import { test, expect } from '@playwright/test'

test('homepage shows products heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Products')).toBeVisible()
})
