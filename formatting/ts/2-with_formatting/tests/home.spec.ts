import { expect, Page, test } from "@playwright/test";

test.describe("Home page should", () => {
	test("add a product to the cart", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 1);

		await thenTheCartShouldContainTotalElements(page, 1);
		await thenTheCartShouldContain(page, "El mejor teclado mecánico");
		await thenTheTotalPriceShouldBe(page, "$129.99");
	});

	test("add a gift product to the cart", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToGiftProductLink(page);

		await thenTheCartShouldContainTotalElements(page, 1);
		await thenTheCartShouldContain(page, "Código de Javi firmado con gpg");
		await thenTheTotalPriceShouldBe(page, "$0.00");
	});

	test("calculate the cart total", async ({ page }) => {
		await givenTheHomePageIsLoaded(page);

		await whenClickToAddProductToCart(page, 1);
		await whenClickToAddProductToCart(page, 2);

		await thenTheCartShouldContainTotalElements(page, 2);
		await thenTheTotalPriceShouldBe(page, "$189.98");
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
) {
	expect(
		await page
			.locator(".flex.justify-between.items-center.mb-4 >> h3")
			.first()
			.textContent(),
	).toBe(expectedProductName);
}

async function thenTheTotalPriceShouldBe(
	page: Page,
	expectedTotalPrice: string,
) {
	expect(
		await page
			.locator("text=Total:")
			.locator("~ span")
			.first()
			.textContent(),
	).toBe(expectedTotalPrice);
}
