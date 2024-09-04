export type DiscountType = "PERCENTAGE" | "FIXED";

export abstract class Discount {
	abstract readonly id: string;
	abstract readonly type: DiscountType;
	abstract readonly value: number;

	isPercentage(): boolean {
		return this.type === "PERCENTAGE";
	}
}
