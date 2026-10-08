
export const formatPrice = (price: number | null, currency: string): string => {

    try {
        if (!price || !currency) {
            return ""
        }

        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(price / 100);

    }
    catch (err) {
        console.error(err);
        return "";
    }
}
