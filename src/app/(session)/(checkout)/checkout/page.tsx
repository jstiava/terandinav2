'use server'
import CheckoutProcessAccordion from "./CheckoutProcessAccordion";
import CheckoutSummaryAside from "./CheckoutSummaryAside";


export default async function CheckoutPage() {

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      {/* Page header */}
      <header className="w-full max-w-[80rem] px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <h1 className="font-canela text-3xl">
          Checkout
        </h1>
      </header>

      {/* Checkout */}
      <main className="w-full max-w-[80rem] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)]">

          {/* Checkout process */}
          <section className="min-w-0">
            <CheckoutProcessAccordion />
          </section>

          {/* Order summary */}
          <CheckoutSummaryAside />

        </div>
      </main>
    </div>
  )
}
