import Link from 'next/link'
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react'

export default function CategoryNotFound() {
    return (
        <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-20">
            <div className="flex w-full max-w-lg flex-col items-center text-center">
                <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="size-7 text-muted-foreground" />
                </div>

                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Category unavailable
                </p>

                <h1 className="font-canela text-4xl tracking-tight sm:text-5xl">
                    We couldn&apos;t find that one.
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                    This collection may have moved, sold out, or is no longer available. Let&apos;s find something else you&apos;ll love.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/products"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        <Search className="size-4" />
                        Explore products
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        <ArrowLeft className="size-4" />
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    )
}