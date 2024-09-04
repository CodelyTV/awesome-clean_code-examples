import { expect, Page, test } from "@playwright/test";

test.describe("Home page should", () => {
	test("add a product to the cart", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 2);

		await thenTheCartShouldContainTotalElements(page, 1);
		await thenTheCartShouldContain(page, "Ratoncito top");
		await thenTheSubtotalPriceShouldBe(page, "$59.99");
		await thenTheTotalPriceShouldBe(page, "$59.99");
	});

	test("add a gift product to the cart", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToGiftProductLink(page);

		await thenTheCartShouldContainTotalElements(page, 1);
		await thenTheCartShouldContain(page, "Código de Javi firmado con gpg");
		await thenTheSubtotalPriceShouldBe(page, "$0.00");
		await thenTheTotalPriceShouldBe(page, "$0.00");
	});

	test("calculate the cart total", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 2);
		await whenClickToAddProductToCart(page, 6);

		await thenTheCartShouldContainTotalElements(page, 2);
		await thenTheSubtotalPriceShouldBe(page, "$99.98");
		await thenTheTotalPriceShouldBe(page, "$99.98");
	});

	test("apply a 5% discount when having 3 different products in the cart", async ({
		page,
	}) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 1);
		await whenClickToAddProductToCart(page, 2);
		await whenClickToAddProductToCart(page, 3);

		await thenTheDiscountShouldAppear(page, "3_DIFFERENT_PRODUCTS");

		await thenTheSubtotalPriceShouldBe(page, "$489.97");
		await thenTheTotalPriceShouldBe(page, "$465.47");
	});

	test("apply a 10 USD discount when having more than 500 in the cart", async ({
		page,
	}) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 3);
		await whenClickToAddProductToCart(page, 3);
		await whenClickToAddProductToCart(page, 3);

		await thenTheDiscountShouldAppear(page, "MORE_THAN_500_USD");

		await thenTheSubtotalPriceShouldBe(page, "$899.97");
		await thenTheTotalPriceShouldBe(page, "$889.97");
	});

	test("combine multiple discounts", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 1);
		await whenClickToAddProductToCart(page, 2);
		await whenClickToAddProductToCart(page, 3);
		await whenClickToAddProductToCart(page, 4);
		await whenClickToAddProductToCart(page, 5);
		await whenClickToAddProductToCart(page, 6);

		await thenTheDiscountShouldAppear(page, "3_DIFFERENT_PRODUCTS");
		await thenTheDiscountShouldAppear(page, "MORE_THAN_500_USD");

		await thenTheSubtotalPriceShouldBe(page, "$819.94");
		await thenTheTotalPriceShouldBe(page, "$768.94");
	});
});

async function givenTheHomePageIsLoaded(page: Page): Promise<void> {
	await page.goto("http://127.0.0.1:3000");
}

async function whenClickToAddProductToCart(
	page: Page,
	productNumber: number,
): Promise<void> {
	await page.click(`text=Añadir al carrito >> nth=${productNumber - 1}`);
}

async function whenClickToGiftProductLink(page: Page): Promise<void> {
	await page.click(`text=Regalo para ti`);
}

async function thenTheCartShouldContainTotalElements(
	page: Page,
	expectedTotalElements: number,
): Promise<void> {
	expect(
		await page
			.locator(".cart .flex.justify-between.items-center.mb-4")
			.count(),
	).toBe(expectedTotalElements);
}

async function thenTheCartShouldContain(
	page: Page,
	expectedProductName: string,
): Promise<void> {
	expect(
		await page
			.locator(".flex.justify-between.items-center.mb-4 >> h3")
			.first()
			.textContent(),
	).toBe(expectedProductName);
}

async function thenTheSubtotalPriceShouldBe(
	page: Page,
	expectedTotalPrice: string,
): Promise<void> {
	expect(
		await page
			.locator(`text="Subtotal:"`)
			.locator("~ span")
			.first()
			.textContent(),
	).toBe(expectedTotalPrice);
}

async function thenTheTotalPriceShouldBe(
	page: Page,
	expectedTotalPrice: string,
): Promise<void> {
	expect(
		await page
			.locator(`text="Total:"`)
			.locator("~ span")
			.first()
			.textContent(),
	).toBe(expectedTotalPrice);
}

async function thenTheDiscountShouldAppear(
	page: Page,
	discountName: string,
): Promise<void> {
	expect(
		await page
			.locator(`text="Descuento: ${discountName}"`)
			.first()
			.textContent(),
	).toBe(`Descuento: ${discountName}`);
}
