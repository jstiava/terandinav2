'use client'

import { Button } from '@/components/ui/button'
import { useContext, useState } from 'react'
import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { CheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ContinueToCheckoutButton() {

    const CartContext = useContext(CartProvider);
    const router = useRouter();

    const [state, setState] = useState<'stable' | 'loading' | 'done'>('stable');

    const onClick = async () => {

        if (state == 'done') {
            setState('stable')
            return
        }
        else if (state == 'loading') {
            return
        }

        setState('loading')
        // handleAddToCart();
        router.push('/checkout');

        setTimeout(() => {
            // setIsDrawerOpen(true);
            CartContext.close();
            setState('stable')
        }, 1000)

    }

    return (
        <div className="flex gap-1 w-full flex-col">
            <Button {...{
                className: "w-full h-12",
                size: 'lg',
                disabled: (!CartContext.cart || CartContext.cart.length === 0),
                onClick
            }}>
                {state == 'stable' && 'Continue as guest'}
                {state == 'loading' && (
                    <div
                        {...{
                            className:
                                'h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white',
                        }}
                    />
                )}
                {state == 'done' && (
                    <>
                        <CheckIcon />
                        Continued to checkout
                    </>
                )}
                {/* {message && <span className='text-xs text-red-400'>{message}</span>} */}
            </Button>
        </div>
    )

}
