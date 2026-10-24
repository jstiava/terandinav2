
export const formatPrice = (priceInCents: number | null, currency: string): string => {

    try {
        if (!priceInCents || !currency) {
            return ""
        }

        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(priceInCents / 100);

    }
    catch (err) {
        console.error(err);
        return "";
    }
}
