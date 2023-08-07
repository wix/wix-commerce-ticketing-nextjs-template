import { test, expect } from '@playwright/test';
import testIds from '@app/utils/test-ids';

test.describe('Shop Page', () => {
  const PATH = '/shop';

  test('look and feel - header', async ({ page }) => {
    await page.goto(PATH);

    await expect(
      await page.getByTestId(testIds.SHOP_PAGE.HEADER)
    ).toHaveScreenshot('shop-header.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('look and feel - products', async ({ page }) => {
    await page.goto(PATH);

    await expect(
      await page.getByTestId(testIds.PRODUCT_LIST.CONTAINER)
    ).toHaveScreenshot('shop-products.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('navigation - "Select Product" navigates to "Product Details" page', async ({
    page,
  }) => {
    await page.goto(PATH);

    await page
      .getByTestId(testIds.PRODUCT_ITEM.PRODUCT_DETAILS_CTA)
      .first()
      .click();

    await expect(
      await page.getByTestId(testIds.PRODUCT_DETAILS.HEADER)
    ).toBeVisible();
  });
});
