"use client";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "@/core/ShoppingCart";

export type Product = {
	id: number;
	name: string;
	price: number;
	image: string;
};

export default function Component() {
	const [quantities, setQuantities] = useState({});
	const [cart] = useState(new ShoppingCart());

	const products: Product[] = [
		{
			id: 1,
			name: "El mejor teclado mecánico",
			price: 129.99,
			image: "https://picsum.photos/seed/z/600/400",
		},
		{
			id: 2,
			name: "Ratoncito top",
			price: 59.99,
			image: "https://picsum.photos/seed/2/600/400",
		},
		{
			id: 3,
			name: "Monitor Ultrawide de Javi",
			price: 299.99,
			image: "https://picsum.photos/seed/3/600/400",
		},
		{
			id: 4,
			name: "Cascos de Javi que acaba de devolver",
			price: 89.99,
			image: "https://picsum.photos/seed/4/600/400",
		},
		{
			id: 5,
			name: "Silla ergonómica",
			price: 199.99,
			image: "https://picsum.photos/seed/5/600/400",
		},
		{
			id: 6,
			name: "Camisa Hawaiiana Codely",
			price: 39.99,
			image: "https://picsum.photos/seed/7/600/400",
		},
	];

	const updateQuantity = (productId: number, newQuantity: number) => {
		setQuantities((prev) => ({
			...prev,
			[productId]: Math.max(0, newQuantity),
		}));
	};

	const addToCartFromGrid = (product: Product): void => {
		const quantity = quantities[product.id] || 1;
		if (quantity === 0) {
			return;
		}

		cart.add(product.id, product.name, quantity, product.price);

		// Reset quantity to 1 after adding to cart
		updateQuantity(product.id, 1);
	};

	const updateCartItemQuantity = (id: number, change: number) => {
		cart.add(id, "", change); // Add or remove items
		setQuantities((prev) => ({
			...prev,
			[id]: cart.getItems().find((item) => item.id === id)?.quantity || 1,
		}));
	};

	const total = cart.getTotal();

	return (
		<div className="flex min-h-screen bg-gray-900 text-gray-100 p-5">
			<main className="flex-grow p-6 pr-[384px]">
				<h1 className="text-2xl font-bold mb-6">codely.shop</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-gray-800 p-4 rounded-lg shadow"
						>
							<img
								src={product.image}
								alt={product.name}
								className="w-full h-48 object-cover mb-4 rounded"
							/>
							<h2 className="text-lg font-semibold">
								{product.name}
							</h2>
							<p className="text-gray-400">
								${product.price.toFixed(2)}
							</p>
							<div className="mt-4 flex items-center justify-between">
								<Input
									type="number"
									min="1"
									value={quantities[product.id] || 1}
									onChange={(e) =>
										updateQuantity(
											product.id,
											parseInt(e.target.value, 10),
										)
									}
									className="w-20 mr-2"
								/>
								<Button
									className="flex-grow"
									onClick={() => addToCartFromGrid(product)}
								>
									Añadir al carrito
								</Button>
							</div>
						</div>
					))}
				</div>
			</main>

			<aside className="fixed top-0 right-0 w-96 h-full bg-gray-800 p-6 overflow-y-auto border-l border-gray-700">
				<h2 className="text-xl font-bold mb-6">Carrito</h2>
				<ScrollArea className="h-[calc(100vh-200px)]">
					{cart.getItems().length === 0 ? (
						<p>Tu carrito está vacío.</p>
					) : (
						cart.getItems().map((item) => (
							<div
								key={item.id}
								className="flex justify-between items-center mb-4"
							>
								<div>
									<h3 className="font-semibold">
										{item.name}
									</h3>
									<p className="text-sm text-gray-400">
										${item.price.toFixed(2)} x{" "}
										{item.quantity}
									</p>
								</div>
								<div className="flex items-center">
									<Button
										size="icon"
										onClick={() =>
											updateCartItemQuantity(item.id, -1)
										}
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="mx-2">
										{item.quantity}
									</span>
									<Button
										size="icon"
										onClick={() =>
											updateCartItemQuantity(item.id, 1)
										}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</ScrollArea>
				<div className="pt-6 border-t border-gray-700">
					<div className="flex justify-between items-center mb-4">
						<span className="font-semibold">Total:</span>
						<span>${total.toFixed(2)}</span>
					</div>
					<Button className="w-full">Comprar</Button>
				</div>
			</aside>
		</div>
	);
}