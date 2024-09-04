type ShoppingCartProduct = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

export class ShoppingCart {
	private products: ShoppingCartProduct[] = [];

	add(
		id: number,
		name: string = "",
		quantity: number = 1,
		price: number = 0,
	): void {
		this.products.push({ id, name, quantity, price });
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
	}

	delete(id: number): void {
		const existingItem = this.products.find((item) => item.id === id);

		if (existingItem) {
			this.products = this.products.filter((item) => item.id !== id);
		}
	}

	totalPrice(): string {
		return this.products
			.reduce((sum, item) => sum + item.price * item.quantity, 0)
			.toFixed(2);
	}

	isEmpty(): boolean {
		return this.products.length === 0;
	}
}
