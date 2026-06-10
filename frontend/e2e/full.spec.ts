import { test, expect } from '@playwright/test'

// Full end-to-end smoke test: register, login, add to cart, add address, checkout, view order, pay

const random = Math.floor(Math.random() * 100000)
const EMAIL = `e2e_user_${random}@example.com`
const PASSWORD = 'password123'
const NAME = `E2EUser${random}`

test('critical path - register -> login -> add to cart -> checkout -> pay', async ({ page }) => {
  // Register
  await page.goto('/register')
  await page.fill('input[name="name"]', NAME)
  await page.fill('input[name="email"]', EMAIL)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button:has-text("Register")')

  // Login
  await page.goto('/login')
  await page.fill('input[name="email"]', EMAIL)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button:has-text("Login")')

  // Wait for login to complete and home to load
  await page.waitForURL('/')

  // Open first product
  const view = page.locator('text=View').first()
  await view.click()

  // Add to cart
  await page.click('button:has-text("Add to cart")')

  // Add address
  await page.goto('/addresses')
  await page.fill('input[name="street"]', '123 E2E St')
  await page.fill('input[name="city"]', 'E2E City')
  await page.fill('input[name="country"]', 'E2E Country')
  await page.click('button:has-text("Add Address")')

  // Checkout
  await page.goto('/checkout')
  await page.selectOption('select', { index: 0 })
  await page.click('button:has-text("Place Order")')

  // Orders
  await page.goto('/orders')
  await expect(page.locator('text=Order #')).toBeVisible()
  await page.click('text=View')

  // Pay
  await page.click('button:has-text("Pay")')
  await expect(page.locator('text=Payment successful')).toBeVisible()
})
