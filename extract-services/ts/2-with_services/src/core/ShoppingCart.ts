import { Discount } from "./discounts/Discount";
import { ShoppingCartDiscountsCalculator } from "./ShoppingCartDiscountsCalculator";
import { ShoppingCartPriceCalculator } from "./ShoppingCartPriceCalculator";

export type ShoppingCartProduct = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

export class ShoppingCart {
	private products: ShoppingCartProduct[] = [];
	private discounts: Discount[] = [];

	constructor(
		private readonly discountsCalculator: ShoppingCartDiscountsCalculator,
		private readonly priceCalculator: ShoppingCartPriceCalculator,
	) {}

	add(id: number, name: string, quantity: number, price: number): void {
		this.products.push({ id, name, quantity, price });

		this.recalculateDiscounts();
	}

	searchAll(): Array<ShoppingCartProduct> {
		return this.products;
	}

	search(id: number): ShoppingCartProduct | null {
		return this.products.find((item) => item.id === id) ?? null;
	}

	changeQuantity(id: number, quantityChange: number): void {
		const product = this.search(id);

		if (product === null) {
			return;
		}

		const newQuantity = Math.max(0, product.quantity + quantityChange);

		if (newQuantity === 0) {
			this.delete(product.id);

			return;
		}

		product.quantity = newQuantity;

		this.recalculateDiscounts();
	}

	subtotalPrice(): number {
		return this.priceCalculator.calculateSubtotal(this.products);
	}

	totalPrice(): number {
		return this.priceCalculator.calculateTotal(
			this.products,
			this.discounts,
		);
	}

	hasDiscounts(): boolean {
		return this.discounts.length > 0;
	}

	getDiscounts(): Discount[] {
		return this.discounts;
	}

	discountsPrice(): number {
		return this.subtotalPrice() - this.totalPrice();
	}

	isEmpty(): boolean {
		return this.products.length === 0;
	}

	private delete(id: number): void {
		const existing = this.products.find((product) => product.id === id);

		if (existing) {
			this.products = this.products.filter(
				(product) => product.id !== id,
			);
		}
	}

	private recalculateDiscounts(): void {
		this.discounts = this.discountsCalculator.calculate(
			this.products.length,
			this.subtotalPrice(),
		);
	}
}
