import { Discount, DiscountType } from "./Discount";

export class MoreThanFiveHundrerUsdDiscount extends Discount {
	readonly id: string = "MORE_THAN_500_USD";
	readonly type: DiscountType = "FIXED";
	readonly value: number = 10;
}
