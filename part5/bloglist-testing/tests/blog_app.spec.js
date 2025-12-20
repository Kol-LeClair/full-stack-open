const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Penelope',
            username: 'username88',
            password: 'password88'
        }
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('username')
    await expect(locator).toBeVisible()
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('username88')
      await page.getByRole('textbox').last().fill('password88')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Penelope logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('username')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('log in to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByRole('textbox').first().fill('username88')
        await page.getByRole('textbox').last().fill('password88')
        await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Testing Title')
        await textboxes[1].fill('Testing Author')
        await textboxes[2].fill('Testing Url')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('Testing Title Testing Author')).toBeVisible()
    })
})
})