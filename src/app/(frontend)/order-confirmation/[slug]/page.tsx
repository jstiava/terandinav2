import Link from 'next/link'
import {
  Check,
  Package,
  Truck,
  MapPin,
  Clock3,
  ArrowLeft,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderConfirmationPageProps {
  params: Promise<{
    id: string
  }>
}

const order = {
  id: 'TER-10482',
  date: 'October 8, 2026',

  status: 'preparing' as const,

  tracking: {
    carrier: 'UPS',
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: 'Monday, October 12',
    trackingUrl: '#',
  },

  items: [
    {
      id: '1',
      name: 'Terandina Performance Jersey',
      variant: 'Black / M',
      quantity: 1,
      price: 65,
      image: '/images/product-placeholder.jpg',
    },
    {
      id: '2',
      name: 'Terandina Training Shorts',
      variant: 'Black / M',
      quantity: 1,
      price: 38,
      image: '/images/product-placeholder.jpg',
    },
  ],

  shipping: 8.95,
  tax: 5.92,

  shippingAddress: {
    firstName: 'John',
    lastName: 'Smith',
    line1: '123 Main Street',
    line2: '',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
  },
}

const trackingSteps = [
  {
    id: 'confirmed',
    title: 'Order confirmed',
    description: 'Your order has been received.',
    icon: Check,
  },

  {
    id: 'preparing',
    title: 'Preparing your order',
    description: 'We are getting your items ready to ship.',
    icon: Package,
  },
  {
    id: 'shipped',
    title: 'Shipped',
    description: 'Your package is on its way.',
    icon: Truck,
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Your package has arrived.',
    icon: MapPin,
  },
]

function TrackingTimeline() {
  const currentStep = 1

  return (
    <div className="space-y-0">
      {trackingSteps.map((step, index) => {
        const Icon = step.icon
        const completed = index <= currentStep
        const current = index === currentStep
        const last = index === trackingSteps.length - 1

        return (
          <div key={step.id} className="relative flex gap-4">
            {!last && (
              <div
                className={[
                  'absolute left-[17px] top-9 h-[calc(100%-8px)] w-px',
                  index < currentStep
                    ? 'bg-foreground'
                    : 'bg-border',
                ].join(' ')}
              />
            )}

            <div
              className={[
                'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border',
                completed
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground',
                current && 'ring-4 ring-muted',
              ].join(' ')}
            >
              <Icon className="size-4" strokeWidth={2.25} />
            </div>

            <div className="pb-8 pt-1">
              <p
                className={[
                  'text-sm font-medium',
                  completed
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                ].join(' ')}
              >
                {step.title}
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Money({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`tabular-nums ${className}`}>
      {children}
    </span>
  )
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params

  // Replace this with your Payload query:
  // const order = await getOrder(id)

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const total = subtotal + order.shipping + order.tax

  return (
    <main className="min-h-screen bg-background pt-14 font-archivo">


      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Confirmation */}
        <section className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary text-background">
            <Check className="size-7" strokeWidth={2.5} />
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Thank you for your order
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl font-canela">
            Your order is confirmed.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            We&apos;ve received your order and will send you an email when
            your package is on its way.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Order {order.id}</span>
            <span>•</span>
            <span>{order.date}</span>
          </div>
        </section>

        {/* Main content */}
        <div className="flex flex-col gap-4 w-full py-12 items-center ">
          <div className="flex flex-col w-full max-w-[45rem]">
            {/* Left */}
            <div className="space-y-6">
              {/* Tracking */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Shipment tracking
                      </CardTitle>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Your package is being prepared.
                      </p>
                    </div>

                    <Badge variant="secondary" className="w-fit">
                      Preparing
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-6 sm:px-6">
                  <TrackingTimeline />

                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader className="px-5 py-5 sm:px-6">
                  <CardTitle className="text-lg">Your order</CardTitle>
                </CardHeader>

                <CardContent className="px-5 pb-5 sm:px-6">
                  <div className="divide-y">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted sm:size-24">
                          {/* Replace with next/image */}
                          <div className="text-xs text-muted-foreground">
                            Image
                          </div>

                          <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-background text-[10px] font-medium shadow-sm">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-medium">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.variant}
                              </p>
                            </div>

                            <Money className="shrink-0 text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </Money>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping address */}
              <Card>
                <CardHeader className="px-5 py-5 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="size-4" />
                    Shipping address
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 pb-5 sm:px-6">
                  <address className="not-italic text-sm leading-6 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {order.shippingAddress.firstName}{' '}
                      {order.shippingAddress.lastName}
                    </span>
                    <br />
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && (
                      <>
                        <br />
                        {order.shippingAddress.line2}
                      </>
                    )}
                    <br />
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </address>
                </CardContent>
              </Card>

              <Card className="lg:sticky lg:top-6">
                <CardHeader className="px-5 py-5 sm:px-6">
                  <CardTitle className="text-lg">Order summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-5 pb-6 sm:px-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>

                      <Money>${subtotal.toFixed(2)}</Money>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Shipping
                      </span>

                      <Money>${order.shipping.toFixed(2)}</Money>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Tax</span>

                      <Money>${order.tax.toFixed(2)}</Money>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">Total</span>

                    <Money className="text-xl font-semibold">
                      ${total.toFixed(2)}
                    </Money>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-4">
                    <div className="flex gap-3">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-sm font-medium">
                          We&apos;ll keep you updated
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          You&apos;ll receive an email with tracking
                          information as soon as your order ships.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Continue shopping
            </Link>
          </Button>
        </div>

        {/* Support */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions about your order?{' '}
          <Link
            href="/contact"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Contact us
          </Link>
        </p>
      </div>
    </main>
  )
}
