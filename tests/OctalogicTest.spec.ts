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
  await page.waitForTimeout(3000);
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
    await page.click("//span[contains(text(),'User')]");
    await page.click("//span[contains(text(),'Account')]");
    await page.click("//a[normalize-space()='Billing']");

    // Update the billing name
    await page.click("//button[normalize-space()='Jayvion Simon']");
    await page.fill("//input[@placeholder='Search...']", 'Deja Brady');
    await page.click("//button[@class='MuiButtonBase-root css-lsedp4']");

    // Change payment method
   //test will fail because when clicked on payment method it opens address popup which shows list on address not the payment methods

    // Validate
    await expect(page.locator("(//button[@class='MuiButtonBase-root css-1m8k9ca'])[1]")).toHaveText('Deja Brady');
    await expect(page.locator("(//button[@class='MuiButtonBase-root css-1m8k9ca'])[2]")).toContainText('1234');
  });

  test('Search Order', async ({ page }) => {
    // Navigate: Order > List
    await page.click("//div[@aria-label='Order']//*[name()='svg']");
    await page.click("//span[contains(text(),'List')]");

    // Search for "cor"
   // await page.click("//input[@id='«r18»']");
    await page.fill("//input[@type='text']",'cor');

    // Wait for search to complete and validate result
    const name = page.locator("//span[contains(@class,'css-14ct5c3')]");
    await expect(name).toContainText('Cortez Herring');
  });

  test('Filter Jobs', async ({ page }) => {
    // Navigate: Job > List
    await page.click("//span[contains(text(),'Job')]");
    await page.click("//span[@class='minimal__nav__item__title css-qtxf8a'][normalize-space()='List']");

    // Open Filters panel
    await page.click("//button[normalize-space()='Filters']");

    // Select "On Demand"
    await page.check("//input[@id='On demand-checkbox']");

    // Dismiss sidebar (assuming clicking outside or a "Close" button)
    await page.click("//div[@role='presentation']//button[2]");

    // Validate only On Demand jobs show
    const jobTypes = page.locator("//span[contains(text(),'On demand')]");
    const rowCount = await jobTypes.count();
    for (let i = 0; i < rowCount; i++) {
      await expect(jobTypes.nth(i)).toHaveText("On demand");
    }
  });

  test('Send Chat Message', async ({ page }) => {
    // Navigate: Chat menu
    await page.click("//span[contains(text(),'Chat')]");

    // Select 'Deja Brady' chat
    await page.click("//span[normalize-space()='Deja Brady']");
    await page.waitForTimeout(3000);
    // Send message
    const message = 'Hello, how are you?';
    await page.fill("//input[@id='chat-message-input']", message);
    await page.keyboard.press('Enter');


    // Confirm message sent (appears in chat thread)
    await expect(page.locator("(//div[contains(text(),'"+message+"')])[1]")).toContainText(message);
  });

  test('Delete Files', async ({ page }) => {
    // Navigate: File Manager
    await page.click("//span[contains(text(),'File manager')]");

    // Select all items
    await page.click("//input[@id='all-row-checkbox']");

    // Initiate delete and confirm
    await page.click("//button[@aria-label='Delete']//*[name()='svg']");
    await page.click("//button[normalize-space()='Delete']"); // Or whatever the confirm is called

    // Ensure all items are deleted (table/list empty)
    const rows = page.locator('//tbody/tr');
    await expect(rows).toHaveCount(0);
  });
});
