import { Discount } from "./discounts/Discount";
import { ShoppingCartProduct } from "./ShoppingCart";

export class ShoppingCartPriceCalculator {
	calculateSubtotal(products: ShoppingCartProduct[]): number {
		return products.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
	}

	calculateTotal(
		products: ShoppingCartProduct[],
		discounts: Discount[],
	): number {
		const subtotal = this.calculateSubtotal(products);

		const totalDiscount = discounts.reduce((sum, discount) => {
			if (discount.isPercentage()) {
				return sum + (discount.value / 100) * subtotal;
			}

			return sum + discount.value;
		}, 0);

		return subtotal - totalDiscount;
	}
}
