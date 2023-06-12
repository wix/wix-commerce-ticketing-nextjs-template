import { test, expect, Page } from '@playwright/test';
import testIds from '@app/utils/test-ids';
import { waitForWixSite } from '@tests/e2e/utils/wix-checkout';

test.describe('Product Page', () => {
  const navigateToProductPage = async (page: Page) => {
    await page.goto('/shop');

    await page
      .getByTestId(testIds.PRODUCT_ITEM.PRODUCT_DETAILS_CTA)
      .first()
      .click();
  };

  test('look and feel - container', async ({ page }) => {
    await navigateToProductPage(page);

    await expect(
      await page.getByTestId(testIds.PRODUCT_DETAILS.CONTAINER)
    ).toHaveScreenshot('product-details.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('navigation - "Buy Now" navigates to Wix "Checkout" page', async ({
    page,
  }) => {
    await navigateToProductPage(page);

    const productName = await page
      .getByTestId(testIds.PRODUCT_DETAILS.HEADER)
      .innerHTML();

    await page.getByTestId(testIds.PRODUCT_DETAILS.BUY_NOW_CTA).first().click();

    await waitForWixSite(page);

    let checkoutIframeSelector = 'iframe[title="Checkout"]';
    const isCheckoutIframe =
      (await page.locator(checkoutIframeSelector).count()) > 0;

    const frame = isCheckoutIframe
      ? page.frameLocator(checkoutIframeSelector)
      : page;
    await expect(await frame.getByText(productName)).toBeVisible();
  });
});
