import { DateRange } from "./DateRange";

export class Promotion {
	constructor(
		readonly dateRange: DateRange,
		readonly discountPercentage: number,
	) {}
}
