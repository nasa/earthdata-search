import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'

import singleCollection from './__mocks__/single_collection.json'

test.describe('Collection List Behavior', () => {
  test.beforeEach(async ({ page, context }) => {
    setupTests(page, context)
    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })

    await page.goto('/')
  })

  test('defaults to the list view and displays results', async ({ page }) => {
    await expect(page.getByTestId('collection-results-list')).toBeVisible()

    await expect(
      (await page.getByTestId('collection-results-item').all()).length
    ).toEqual(1)
  })

  test('toggles to the table view and displays results', async ({ page }) => {
    await page.getByTestId('panel-group-header-dropdown__view__0').hover()

    await page.getByTestId('panel-group-header-dropdown__view__0__menu').getByText('Table').click()

    await expect(page.getByTestId('collection-results-table')).toBeVisible()

    await expect(
      (await page.getByTestId('collection-results-table__item').all()).length
    ).toEqual(1)
  })
})
