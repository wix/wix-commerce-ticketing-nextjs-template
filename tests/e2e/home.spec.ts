import { test, expect } from '@playwright/test';
import testIds from '@app/utils/test-ids';

test.describe('Home Page', () => {
  const PATH = '/';

  test('look and feel - header', async ({ page }) => {
    await page.goto(PATH);

    await expect(
      await page.getByTestId(testIds.HOME_PAGE.HEADER)
    ).toHaveScreenshot('home-header.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('look and feel - tickets', async ({ page }) => {
    await page.goto(PATH);

    await expect(
      await page.getByTestId(testIds.TICKET_LIST.CONTAINER)
    ).toHaveScreenshot('home-tickets.png', {
      mask: [page.getByTestId(testIds.LAYOUT.HEADER)],
    });
  });

  test('navigation - "Select Ticket" navigates to "Ticket Details" page', async ({
    page,
  }) => {
    await page.goto(PATH);

    await page.getByTestId(testIds.TICKET_ITEM.SELECT_CTA).first().click();

    await expect(
      await page.getByTestId(testIds.TICKET_DETAILS_PAGE.HEADER)
    ).toBeVisible();
  });
});
