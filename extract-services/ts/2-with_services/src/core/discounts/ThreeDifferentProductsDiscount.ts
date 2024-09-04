import { Discount, DiscountType } from "./Discount";

export class ThreeDifferentProductsDiscount extends Discount {
	readonly id: string = "3_DIFFERENT_PRODUCTS";
	readonly type: DiscountType = "PERCENTAGE";
	readonly value: number = 5;
}
