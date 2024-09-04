import { Discount } from "./discounts/Discount";
import { MoreThanFiveHundrerUsdDiscount } from "./discounts/MoreThanFiveHundrerUsdDiscount";
import { ThreeDifferentProductsDiscount } from "./discounts/ThreeDifferentProductsDiscount";

export class ShoppingCartDiscountsCalculator {
	calculate(totalProductsInCart: number, subtotalPrice: number): Discount[] {
		const discounts: Discount[] = [];

		if (totalProductsInCart >= 3) {
			discounts.push(new ThreeDifferentProductsDiscount());
		}

		if (subtotalPrice > 500) {
			discounts.push(new MoreThanFiveHundrerUsdDiscount());
		}

		return discounts;
	}
}
