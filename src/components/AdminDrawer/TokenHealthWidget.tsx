"use client";

import React, { useEffect, useState, useCallback } from "react";

interface JwtPayload {
  exp?: number;
  iat?: number;
  id?: string;
  email?: string;
  collection?: string;
  [key: string]: unknown;
}

interface TokenHealthProps {
  /** Optional token passed from a Server Component or parent */
  initialToken?: string | null;
  /** Cookie name to read on the client (defaults to "payload-token") */
  cookieName?: string;
  /** Token refresh endpoint */
  refreshEndpoint?: string;
  /** Threshold in seconds before expiry to trigger warning state */
  warningThresholdSec?: number;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function TokenHealthWidget({
  initialToken = null,
  cookieName = "payload-token",
  refreshEndpoint = "/api/users/refresh-token",
  warningThresholdSec = 120,
}: TokenHealthProps) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [nowSec, setNowSec] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [refreshLatencyMs, setRefreshLatencyMs] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const syncCookie = useCallback(() => {
    const cookieToken = getCookie(cookieName);
    if (cookieToken) {
      setToken(cookieToken);
    } else if (initialToken !== undefined) {
      setToken(initialToken);
    }
  }, [cookieName, initialToken]);

  // Seed with initialToken, then sync with cookie and tick every second
  useEffect(() => {
    syncCookie();
    const tick = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
      syncCookie();
    }, 1000);
    return () => clearInterval(tick);
  }, [syncCookie]);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setLastError(null);
    const start = performance.now();

    try {
      const res = await fetch(refreshEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const duration = Math.round(performance.now() - start);
      setRefreshLatencyMs(duration);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      syncCookie();
    } catch (err) {
      setLastError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshEndpoint, syncCookie]);

  const payload = token ? decodeJwt(token) : null;
  const exp = payload?.exp ?? 0;
  const iat = payload?.iat ?? 0;
  const ttlRemaining = exp ? exp - nowSec : 0;
  const totalLifespan = exp && iat ? exp - iat : 0;
  const progressPct =
    totalLifespan > 0 ? Math.max(0, Math.min(100, (ttlRemaining / totalLifespan) * 100)) : 0;

  let status: "healthy" | "expiring" | "expired" | "missing" = "missing";
  if (token && payload) {
    if (ttlRemaining <= 0) status = "expired";
    else if (ttlRemaining <= warningThresholdSec) status = "expiring";
    else status = "healthy";
  }

  const badgeColors = {
    healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expiring: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-rose-50 text-rose-700 border-rose-200",
    missing: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-700 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <span className="font-semibold text-slate-900">Token Health</span>
          <span className="ml-1.5 text-[10px] text-slate-400">({cookieName})</span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badgeColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
          <div className="text-[10px] font-medium text-slate-400">TTL REMAINING</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">
            {status === "missing"
              ? "—"
              : ttlRemaining > 0
              ? `${Math.floor(ttlRemaining / 60)}m ${ttlRemaining % 60}s`
              : "0s (Expired)"}
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
          <div className="text-[10px] font-medium text-slate-400">REFRESH LATENCY</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">
            {refreshLatencyMs !== null ? `${refreshLatencyMs} ms` : "Not tested"}
          </div>
        </div>
      </div>

      {/* TTL Progress Bar */}
      {totalLifespan > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full transition-all duration-500 ${
                status === "healthy"
                  ? "bg-emerald-500"
                  : status === "expiring"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer & Refresh Action */}
      <div className="mt-3 flex items-center justify-between pt-1 text-[11px] text-slate-500">
        <span className="truncate pr-2">
          {payload?.email
            ? String(payload.email)
            : iat
            ? `Issued ${new Date(iat * 1000).toLocaleTimeString()}`
            : "Token not found"}
        </span>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing..." : "Test Refresh"}
        </button>
      </div>

      {lastError && (
        <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] text-rose-600">
          Error: {lastError}
        </div>
      )}
    </div>
  );
}