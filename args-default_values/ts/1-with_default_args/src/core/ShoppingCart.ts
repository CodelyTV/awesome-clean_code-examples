type ShoppingCartItem = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

export class ShoppingCart {
	private items: Array<ShoppingCartItem> = [];

	add(
		id: number,
		name: string,
		quantity: number = 1,
		price: number = 0,
	): void {
		const existingItem = this.get(id);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			this.items.push({ id, name, quantity, price });
		}
	}

	exists(id: number): boolean {
		return this.items.find((item) => item.id === id) !== undefined;
	}

	private get(id: number): ShoppingCartItem | undefined {
		return this.items.find((item) => item.id === id);
	}

	remove(id: number, quantity: number = 1): void {
		const existingItem = this.items.find((item) => item.id === id);

		if (existingItem) {
			existingItem.quantity = Math.max(
				0,
				existingItem.quantity - quantity,
			);
			if (existingItem.quantity === 0) {
				this.items = this.items.filter((item) => item.id !== id);
			}
		}
	}

	getItems(): Array<{
		id: number;
		name: string;
		quantity: number;
		price: number;
	}> {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
	}
}
