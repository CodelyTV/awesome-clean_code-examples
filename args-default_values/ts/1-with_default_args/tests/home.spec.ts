import { expect, Page, test } from "@playwright/test";

test.describe("Home page should", () => {
	test("add a product to the cart", async ({ page }) => {
		await goToHomePage(page);

		await clickAddToCart(page, 1);

		await expectCartToContainTotalElements(page, 1);
		await expectCartToContainProduct(page, "El mejor teclado mecánico");
		await expectTotalPriceToBe(page, "$129.99");
	});

	test("calculate the cart total", async ({ page }) => {
		await goToHomePage(page);

		await clickAddToCart(page, 1);
		await clickAddToCart(page, 2);

		await expectCartToContainTotalElements(page, 2);
		await expectTotalPriceToBe(page, "$189.98");
	});
});

async function goToHomePage(page: Page): Promise<void> {
	await page.goto("http://127.0.0.1:3000");
}

async function clickAddToCart(
	page: Page,
	productNumber: number,
): Promise<void> {
	await page.click(`text=Añadir al carrito >> nth=${productNumber - 1}`);
}

async function expectCartToContainTotalElements(
	page: Page,
	expectedTotalElements: number,
): Promise<void> {
	expect(
		await page
			.locator(".cart .flex.justify-between.items-center.mb-4")
			.count(),
	).toBe(expectedTotalElements);
}

async function expectCartToContainProduct(
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

async function expectTotalPriceToBe(page: Page, expectedTotalPrice: string) {
	expect(
		await page
			.locator("text=Total:")
			.locator("~ span")
			.first()
			.textContent(),
	).toBe(expectedTotalPrice);
}
