import CheckoutCartInventory from "./CheckoutCartInventory";
import CheckoutOrderReceiptPreview from "./CheckoutOrderReceiptPreview";
import CheckoutProcessAccordion from "./CheckoutProcessAccordion";


export default async function CheckoutPage() {

  return (
    <div className="flex flex-col items-center w-full h-fit pt-16">

      <h1 {...{
        className: "text-2xl font-canela"
      }}>Checkout</h1>

      {/* Checkout content */}
      <div className="flex flex-col md:flex-row w-full max-w-[80rem] justify-center h-fit">

        {/* Inventory */}
        <div className="flex flex-col gap-4 w-full md:w-[55%] max-w-[30rem] p-4 py-8">
          <CheckoutProcessAccordion />
        </div>

        {/* Summary sidebar */}
        <div className="flex flex-1 min-w-0 max-w-[30rem]">
          <div className="flex flex-col gap-4 w-full p-8">

            <h3 {...{
              className: 'text-xl font-canela'
            }}>My Cart</h3>
            <CheckoutCartInventory />

            <div className="w-full h-[1px] bg-border rounded-full" />

            <CheckoutOrderReceiptPreview />

          </div>
        </div>
      </div>

    </div>
  )
}
