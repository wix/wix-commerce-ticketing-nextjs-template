import { test, expect, Page } from '@playwright/test';
import testIds from '@app/utils/test-ids';
import { waitForWixSite } from '@tests/e2e/utils/wix-checkout';

test.describe('Tickets Page', () => {
  const navigateToTicketsPage = async (page: Page) => {
    await page.goto('/');

    await page.getByTestId(testIds.TICKET_ITEM.SELECT_CTA).first().click();
  };

  test('look and feel - "Ticket Details"', async ({ page }) => {
    await navigateToTicketsPage(page);

    await expect(
      await page.getByTestId(testIds.TICKET_DETAILS_PAGE.CONTAINER)
    ).toHaveScreenshot('ticket-details.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('navigation - "Select Ticket" navigates to "Checkout" page', async ({
    page,
  }) => {
    await navigateToTicketsPage(page);
    const numOfTicketsToSelect = '2';

    await page.waitForSelector('.flowbite-dropdown-target');
    await page.waitForTimeout(3000);

    await (await page.$$('.flowbite-dropdown-target')).pop()!.click();

    await page
      .getByTestId(testIds.TICKET_DETAILS_PAGE.TICKETS_NUMBER_OPTIONS)
      .getByText(numOfTicketsToSelect, { exact: true })
      .first()
      .click();

    await page.getByTestId(testIds.TICKET_DETAILS_PAGE.CHECKOUT_CTA).click();

    await waitForWixSite(page);

    await expect(await page.getByText('Add your details')).toBeVisible();
  });
});
