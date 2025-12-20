const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
        data: {
            name: 'Penelope',
            username: 'username88',
            password: 'password88'
        }
    })

    await request.post('/api/users', {
        data: {
            name: 'Me',
            username: 'username',
            password: 'password'
        }
    })
    
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('username')
    await expect(locator).toBeVisible()
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'username88', 'password88')

      await expect(page.getByText('Penelope logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'username2', 'password2')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    // await expect(errorDiv).toHaveCSS('border-style', 'solid')
    // await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'username88', 'password88')
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

    test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Testing Title')
        await textboxes[1].fill('Testing Author')
        await textboxes[2].fill('Testing Url')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1')).toBeVisible()
    })
    
    test('a blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Testing Title')
        await textboxes[1].fill('Testing Author')
        await textboxes[2].fill('Testing Url')
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).toBeVisible()
        
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Testing Title Testing Author')).not.toBeVisible()
    })

    test('a blog cannnot be deleted by a different user', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Testing Title')
        await textboxes[1].fill('Testing Author')
        await textboxes[2].fill('Testing Url')
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'username', 'password')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).not.toBeVisible()
    })
        
})
})