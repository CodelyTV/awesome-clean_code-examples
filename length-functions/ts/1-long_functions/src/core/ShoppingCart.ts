type ShoppingCartProduct = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

type Discount = {
	name: "3_DIFFERENT_PRODUCTS" | "MORE_THAN_500_USD" | "4_PRODUCTS";
	type: "PERCENTAGE" | "FIXED";
	value: number;
};

export class ShoppingCart {
	private products: ShoppingCartProduct[] = [];
	private discounts: Discount[] = [];

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
		return this.products.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
	}

	totalPrice(): number {
		const subtotal = this.subtotalPrice();

		const totalDiscount = this.discounts.reduce((sum, discount) => {
			if (discount.type === "PERCENTAGE") {
				return sum + (discount.value / 100) * subtotal;
			}

			return sum + discount.value;
		}, 0);

		return subtotal - totalDiscount;
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
		const discounts: Discount[] = [];

		if (this.products.length > 2) {
			discounts.push({
				name: "3_DIFFERENT_PRODUCTS",
				type: "PERCENTAGE",
				value: 5,
			});
		}

		if (this.subtotalPrice() > 500) {
			discounts.push({
				name: "MORE_THAN_500_USD",
				type: "FIXED",
				value: 10,
			});
		}

		this.discounts = discounts;
	}
}
