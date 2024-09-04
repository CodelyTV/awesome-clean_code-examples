"use client";
import { Info, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { ShoppingCart } from "../core/ShoppingCart";
import { ShoppingCartDiscountsCalculator } from "../core/ShoppingCartDiscountsCalculator";
import { ShoppingCartPriceCalculator } from "../core/ShoppingCartPriceCalculator";

export type Product = {
	id: number;
	name: string;
	price: number;
	image: string;
};

export default function Component() {
	const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
	const [cart] = useState(
		new ShoppingCart(
			new ShoppingCartDiscountsCalculator(),
			new ShoppingCartPriceCalculator(),
		),
	);

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

	const giftProductId = 999;

	const addGridProductToCart = (product: Product): void => {
		const quantity = quantities[product.id] ?? 1;

		const existingProduct = cart.search(product.id);

		if (existingProduct === null) {
			cart.add(product.id, product.name, quantity, product.price);
		} else {
			cart.changeQuantity(product.id, quantity);
		}

		updateQuantity(product.id, 1);
	};

	const addGiftProductToCart = (): void => {
		const product = cart.search(giftProductId);

		if (!product) {
			cart.add(giftProductId, "Código de Javi firmado con gpg", 1, 0);
			updateQuantity(giftProductId, 1);
		}
	};

	const updateCartProductQuantity = (id: number, change: number) => {
		cart.changeQuantity(id, change);

		setQuantities((prev) => ({
			...prev,
			[id]: cart.search(id)?.quantity ?? 1,
		}));
	};

	return (
		<div className="flex min-h-screen bg-gray-900 text-gray-100 p-5">
			<main className="flex-grow p-6 pr-[384px]">
				<h1 className="text-2xl font-bold mb-6">codely.shop</h1>
				<Alert variant="default" className="mb-6">
					<Info className="h-4 w-4" style={{ marginTop: "-3px" }} />
					<AlertDescription>
						Tenemos una sorpresa para ti 👀{" "}
						<a
							href="#"
							className="underline"
							onClick={() => addGiftProductToCart()}
						>
							¡Un producto de regalo para ti!
						</a>
						.
					</AlertDescription>
				</Alert>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-products">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-gray-800 p-4 rounded-lg shadow"
						>
							<Image
								src={product.image}
								alt={product.name}
								width={600}
								height={600}
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
									value={quantities[product.id] ?? 1}
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
									onClick={() =>
										addGridProductToCart(product)
									}
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
				<ScrollArea className="h-[calc(100vh-200px)] cart">
					{cart.isEmpty() ? (
						<p>Tu carrito está vacío.</p>
					) : (
						cart.searchAll().map((product) => (
							<div
								key={product.id}
								className="flex justify-between items-center mb-4"
							>
								<div>
									<h3 className="font-semibold">
										{product.name}
									</h3>
									<p className="text-sm text-gray-400">
										${product.price.toFixed(2)} x{" "}
										{product.quantity}
									</p>
								</div>
								<div className="flex items-center">
									<Button
										size="icon"
										onClick={() =>
											updateCartProductQuantity(
												product.id,
												-1,
											)
										}
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="mx-2">
										{product.quantity}
									</span>
									<Button
										size="icon"
										onClick={() =>
											updateCartProductQuantity(
												product.id,
												1,
											)
										}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</ScrollArea>
				<div
					className="pt-6 border-t border-gray-700 totals"
					style={{ marginTop: "-100px" }}
				>
					{cart.hasDiscounts() &&
						cart.getDiscounts().map((discount) => (
							<div className="mb-4">
								<Alert variant="default">
									Descuento: {discount.id}
								</Alert>
							</div>
						))}
					<div className="flex justify-between items-center mb-4">
						<span>Subtotal:</span>
						<span>${cart.subtotalPrice().toFixed(2)}</span>
					</div>
					{cart.hasDiscounts() && (
						<div className="flex justify-between items-center mb-4">
							<span>Discounts:</span>
							<span>-${cart.discountsPrice().toFixed(2)}</span>
						</div>
					)}
					<div className="flex justify-between items-center mb-4">
						<span className="font-semibold">Total:</span>
						<span>${cart.totalPrice().toFixed(2)}</span>
					</div>
					<Button className="w-full">Comprar</Button>
				</div>
			</aside>
		</div>
	);
}
