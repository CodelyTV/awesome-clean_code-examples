import { Promotion } from "./Promotion";

export interface PromotionRepository {
	save(promotion: Promotion): Promise<void>;
}
