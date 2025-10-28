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

    // These tests are asserting that the notification preference requests correctly go to CMR Ordering
    await page.route('https://cmr.earthdata.nasa.gov/ordering/api', (route) => {
      const { query } = JSON.parse(route.request().postData())

      if (query.includes('query User')) {
        route.fulfill({
          status: 200,
          json: {
            data: {
              user: {
                ursId: 'testuser',
                notificationLevel: 'DETAIL'
              }
            }
          }
        })
      }

      if (query.includes('mutation UpdateUser')) {
        route.fulfill({
          status: 200,
          json: {
            data: {
              updateUser: {
                ursId: 'testuser',
                notificationLevel: 'NONE'
              }
            }
          }
        })
      }
    })

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

    await expect(await page.getByLabel('Receive delayed access')).toHaveValue('DETAIL')
  })

  test.describe('when updating the notification level', () => {
    test('updates the notification level', async ({ page }) => {
      await page.getByLabel('Receive delayed access').selectOption('NONE')

      const requestPromise = page.waitForRequest('https://cmr.earthdata.nasa.gov/ordering/api')
      await page.getByRole('button', { name: 'Update Notification Preference' }).click()
      await requestPromise

      // Toast text
      await expect(await page.getByText('Notification Preference Level updated')).toBeVisible()

      await expect(await page.getByLabel('Receive delayed access')).toHaveValue('NONE')
    })
  })
})
