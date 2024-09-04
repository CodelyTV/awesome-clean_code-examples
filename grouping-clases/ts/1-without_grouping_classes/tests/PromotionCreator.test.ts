import { Promotion } from "../src/Promotion";
import { PromotionCreator } from "../src/PromotionCreator";
import { PromotionRepository } from "../src/PromotionRepository";

describe("PromotionCreator should", () => {
	const repository = {
		save: jest.fn(),
	} as unknown as PromotionRepository;
	const promotionCreator = new PromotionCreator(repository);

	it("create a valid promotion", async () => {
		const startDate = new Date("2024-09-01");
		const endDate = new Date("2024-09-30");
		const discountPercentage = 20;

		const expectedPromotion = new Promotion(
			startDate,
			endDate,
			discountPercentage,
		);

		await promotionCreator.create(startDate, endDate, discountPercentage);

		expect(repository.save).toHaveBeenCalledWith(expectedPromotion);
	});

	it("throw an error creating a promotion with invalid date range", async () => {
		const startDate = new Date("2026-09-30");
		const endDate = new Date("2026-09-01");
		const discountPercentage = 20;

		await expect(
			promotionCreator.create(startDate, endDate, discountPercentage),
		).rejects.toThrow("End date must be after start date");
	});
});
