import { test, expect } from 'playwright-test-coverage'
import { login } from '../../../support/login'
import { setupTests } from '../../../support/setupTests'

test.describe('Contact Info Page', () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    await setupTests({
      browserName,
      context,
      page
    })

    await login(page, context)

    await page.goto('/contact-info')
  })

  test('displays user contact information', async ({ page }) => {
    await expect(await page.getByRole('listitem').filter({ hasText: 'First Name' })).toContainText('test')
    await expect(await page.getByRole('listitem').filter({ hasText: 'Last Name' })).toContainText('user')
    await expect(await page.getByRole('listitem').filter({ hasText: 'Email' })).toContainText('test@example.com')
    await expect(await page.getByRole('listitem').filter({ hasText: 'Organization Name' })).toBeVisible()
    await expect(await page.getByRole('listitem').filter({ hasText: 'Country' })).toContainText('United States')
    await expect(await page.getByRole('listitem').filter({ hasText: 'Affiliation' })).toContainText('OTHER')
    await expect(await page.getByRole('listitem').filter({ hasText: 'Study Area' })).toContainText('Other')
    await expect(await page.getByRole('listitem').filter({ hasText: 'User Type' })).toContainText('Public User')
  })
})
