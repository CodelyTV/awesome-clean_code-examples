import { DateRange } from "./DateRange";
import { Promotion } from "./Promotion";
import { PromotionRepository } from "./PromotionRepository";

export class PromotionCreator {
	constructor(private readonly repository: PromotionRepository) {}

	async create(
		startDate: Date,
		endDate: Date,
		discountPercentage: number,
	): Promise<void> {
		const promotion = new Promotion(
			new DateRange(startDate, endDate),
			discountPercentage,
		);

		await this.repository.save(promotion);
	}
}
