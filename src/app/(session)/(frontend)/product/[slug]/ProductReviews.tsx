'use server'

import { ReviewBlock } from "@/collections/Products/ReviewBlock"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"



export default async function ProductReview() {

    return (
        <div className="flex flex-col w-full px-5 py-0 gap-0 ">

            <span {...{
                className: 'text-xs'
            }}>Reviews & comments</span>

            {/* Stars */}
            <div className="flex items-center gap-2 w-full">
                <span className="text-[2rem] tracking-tight font-black">5</span>
                <div className="flex gap-1 items-center w-fit">
                    <StarIcon className="size-4" />
                    <StarIcon className="size-4" />
                    <StarIcon className="size-4" />
                    <StarIcon className="size-4" />
                    <StarIcon className="size-4" />
                </div>
            </div>

            <ReviewBlock {...{
                blockType: "review",
                reviews: [
                    {
                        author: "John B",
                        quote: "Beautiful patterns, fits small.",
                        rating: 5
                    },
                    {
                        author: "Cardi B",
                        quote: "Comfortable fit",
                        rating: 4
                    }
                ]
            }} />

            <Button {...{
                className: 'mt-6',
                variant: "outline"
            }}>Leave a review</Button>

        </div>
    )
}