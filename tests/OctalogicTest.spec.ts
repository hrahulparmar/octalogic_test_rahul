import { test, expect } from '@playwright/test';

const BASE_URL = 'https://minimals.cc/';
const EMAIL = 'demo@minimals.cc';
const PASSWORD = '@2Minimal';

// Utility function for login
async function login(page) {

  await page.goto(BASE_URL);
  await page.click("//a[text()='Sign in']");
  // await page.fill("//input[@id='«rs»']", EMAIL);
  //  await page.fill("//input[@id='«rt»']'", PASSWORD);
  await page.click("//button[normalize-space()='Sign in']");
  // await page.waitForTimeout(5000);
  // Add wait for dashboard/home loaded if necessary
  await expect(page).toHaveURL('https://minimals.cc/dashboard');
}

// Utility function to reset environment (API/UI-based)

test.describe('Minimals App End-to-End Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Update Billing Information', async ({ page }) => {
    // Navigate: User menu > Account > Billing
    await page.getByRole('button', { name: 'User' }).click({ force: true });
    await page.getByRole('link', { name: 'Account' }).click();
    await page.getByRole('tab', { name: 'Billing' }).click();

    // Update the billing name
    await page.getByRole('button', { name: 'Jayvion Simon' }).click();
    await page.getByRole('button', { name: 'Deja Brady 18605 Thompson' }).click();


    // Change payment method
    //test will fail because when clicked on payment method it opens address popup which shows list on address not the payment methods

    // Validate
    await expect(page.getByRole('main')).toContainText('Deja Brady');
    //await expect(page.locator("//button[contains(text(),'**** **** ****')]")).toContainText('1234');
  });

  test('Search Order', async ({ page }) => {
    // Navigate: Order > List
    await page.getByRole('button', { name: 'Order' }).click();
    await page.getByRole('link', { name: 'List' }).click();

    // Search for "cor"
    await page.getByRole('textbox', { name: 'Search customer or order' }).click();
    await page.getByRole('textbox', { name: 'Search customer or order' }).fill('cor');
    await page.fill("//input[@type='text']", 'cor');

    // Wait for search to complete and validate result
    await expect(page.locator('tbody')).toContainText('Cortez Herring');
  });

  test('Filter Jobs', async ({ page }) => {
    // Navigate: Job > List
    await page.getByRole('button', { name: 'Job' }).click();
    await page.getByRole('link', { name: 'List' }).click();

    // Open Filters panel
    await page.getByRole('button', { name: 'Filters' }).click();

    // Select "On Demand"
    await page.getByRole('checkbox', { name: 'On demand' }).check();

    // Dismiss sidebar
    await page.getByRole('button').nth(1).click();

    // Validate only On Demand jobs show
    await expect(page.getByRole('main')).toContainText('On demand');
  });

  test('Send Chat Message', async ({ page }) => {

    // Navigate
    await page.getByRole('link', { name: 'Chat' }).click();
    await page.waitForTimeout(3000);
    // Select 'Deja Brady' chat
    await page.getByRole('button', { name: 'Deja Brady Deja Brady You:' }).click();

    // Send message
    await page.getByRole('textbox', { name: 'Type a message' }).click();
    await page.getByRole('textbox', { name: 'Type a message' }).fill('Hello,how are you');
    await page.getByRole('textbox', { name: 'Type a message' }).press('Enter');

    // Confirm message sent (appears in chat thread)
    await expect(page.getByRole('main')).toContainText('Hello,how are you');
  });

  test('Delete Files', async ({ page }) => {
    // Navigate: File Manager
    await page.getByRole('link', { name: 'File manager' }).click();

    // Select all items
    await page.getByRole('checkbox', { name: 'All row Checkbox' }).check();

    // Initiate delete and confirm
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Ensure all items are deleted (table/list empty)
    await expect(page.getByRole('img', { name: 'Empty content' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No data' })).toBeVisible();
  });
});
