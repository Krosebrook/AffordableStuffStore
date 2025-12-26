import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle(/FlashFusion/);
  
  const heading = page.locator('h1');
  await expect(heading).toContainText('FlashFusion');
});

test('homepage displays architecture features', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('text=Monorepo')).toBeVisible();
  await expect(page.locator('text=Backend')).toBeVisible();
  await expect(page.locator('text=Observability')).toBeVisible();
});
