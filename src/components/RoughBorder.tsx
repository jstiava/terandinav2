// RoughBorder.tsx
import { cn } from "@/utilities/ui";
import React, { useRef, useEffect } from "react";
import rough from "roughjs";

const RoughBorder: React.FC<{
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  padding?: number;
  className?: string;
  style?: any;
  children: React.ReactNode;
}> = ({
  stroke = "#222",
  strokeWidth = 2,
  roughness = 1.5,
  padding = 8,
  className = "",
  style = {},
  children,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      const svg = svgRef.current;
      if (!wrapper || !svg) return;

      const { width, height } = wrapper.getBoundingClientRect();

      // Resize SVG
      svg.setAttribute("width", `${width}`);
      svg.setAttribute("height", `${height}`);

      // Clear previous drawings
      svg.innerHTML = "";

      const rc = rough.svg(svg);

      const node = rc.rectangle(
        strokeWidth / 2,
        strokeWidth / 2,
        width - strokeWidth,
        height - strokeWidth,
        {
          stroke,
          strokeWidth,
          roughness,
        }
      );

      svg.appendChild(node);
    }, [stroke, strokeWidth, roughness, children]);

    return (
      <div
        ref={wrapperRef}
        className={
          cn("relative inline-block h-fit w-fit", className)
        }
      style={{ padding, ...style }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        preserveAspectRatio="none"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default RoughBorder;
