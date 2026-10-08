type ReviewBlockProps = {
    blockType: "review"
    reviews: {
        quote: string
        author: string
        rating?: number
    }[]
}

export function ReviewBlock({ reviews }: ReviewBlockProps) {
    return (
        <section className="flex flex-col gap-2 text-xs ">
            {reviews.map((review, index) => (
                <article key={index}>
                    {review.rating && <div>{"★".repeat(review.rating)}</div>}

                    <blockquote>{review.quote}</blockquote>

                    <p>{review.author}</p>
                </article>
            ))}
        </section>
    )
}