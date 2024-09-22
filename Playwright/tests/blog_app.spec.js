const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123'
      }
    })

    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('Login form is displayed with required fields and buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  
    await expect(page.getByPlaceholder('Username')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
  
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible()
  })
})