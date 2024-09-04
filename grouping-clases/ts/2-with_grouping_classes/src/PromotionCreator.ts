import { Promotion } from "./Promotion";
import { PromotionRepository } from "./PromotionRepository";

export class PromotionCreator {
	constructor(private readonly repository: PromotionRepository) {}

	async create(
		startDate: Date,
		endDate: Date,
		discountPercentage: number,
	): Promise<void> {
		if (startDate >= endDate) {
			throw new Error("End date must be after start date");
		}

		const promotion = new Promotion(startDate, endDate, discountPercentage);

		await this.repository.save(promotion);
	}
}
