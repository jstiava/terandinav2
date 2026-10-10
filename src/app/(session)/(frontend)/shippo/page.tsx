'use server'

import { generateShippoShipment } from "@/app/(session)/(checkout)/checkout/ShippoService";
import { Check, Truck } from "lucide-react";
import Image from "next/image";


export default async function ShippoTest() {

  const shipment = await generateShippoShipment({
    addressFrom: {
      name: 'Terandina',
      street1: '1978 Southlake Mall',
      street2: '#144',
      city: 'Merrillville',
      state: 'IN',
      zip: '46410',
      country: 'US',
    },
    addressTo: {
      name: 'Jeremy Stiava',
      street1: '3511 N Rutherford Ave',
      street2: '',
      city: 'Chicago',
      state: 'IL',
      zip: '60634',
      country: 'US',
    },
    parcels: [
      {
        length: String(12),
        width: String(10),
        height: String(3),
        distanceUnit: 'in',
        weight: String(1.5),
        massUnit: 'lb',
      },
    ]
  });

  const sortedRates = [...shipment.rates].sort(
    (a, b) => Number(a.amount) - Number(b.amount)
  )


  return (
    <div className="flex flex-col gap-4 pt-14">
      <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-xs whitespace-pre-wrap break-words">
        {JSON.stringify(shipment, null, 2)}
      </pre>

      <div className="flex flex-col gap-3">
        {sortedRates.map((rate: any) => {
          const selected = false

          return (
            <button
              key={rate.objectId}
              type="button"
              // onClick={() => setSelectedRate(rate.objectId)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${selected
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-foreground/30 hover:bg-muted/40'
                }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1">
                <Image
                  src={rate.providerImage75}
                  alt={rate.provider}
                  width={40}
                  height={40}
                  className="size-full object-contain"
                  unoptimized
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-medium">{rate.provider}</span>
                <span className="text-sm text-muted-foreground">
                  {rate.servicelevel?.name ?? 'Standard shipping'}
                </span>
                {rate.estimatedDays != null && (
                  <span className="text-xs text-muted-foreground">
                    Estimated {rate.estimatedDays} business days
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="font-semibold tabular-nums">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: rate.currency ?? 'USD',
                  }).format(Number(rate.amount))}
                </span>
                <div className={`flex size-5 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                  }`}>
                  {selected && <Check className="size-3" />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}