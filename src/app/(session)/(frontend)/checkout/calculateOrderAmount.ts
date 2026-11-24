import { ProductType } from "@/components/Cart/CartProviderComponent";

export const calculateOrderAmount = (target: ProductType | ProductType[]) => {

    if (Array.isArray(target)) {
        let amount = 0;
        for (const product of target) {
            amount += calculateOrderAmount(product);
        }
        return amount;
    }

    if (!target.product.prices || target.product.prices.length == 0) {
        return 0;
    }

    return Number(((target.product.prices[0].amount) * 100 * target.quantity).toFixed(0))
};