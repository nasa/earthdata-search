import { test, expect } from 'playwright-test-coverage'

import moment from 'moment'
import { setupTests } from '../../support/setupTests'

import singleCollection from '../collection_list/__mocks__/single_collection.json'

test.describe('Temporal Dropdown Behavior', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })

    await page.route(/collections.json/, async (route) => {
      await route.fulfill({
        json: singleCollection.body,
        headers: singleCollection.headers
      })
    })
  })

  test.describe('when NO temporal search results are recieved from edsc store', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await expect(page.getByTestId('collection-results-list')).toBeVisible()
      await page.getByRole('button', { name: 'Open temporal filters' }).click()
    })

    test('default settings are used to render dropdown menu', async ({ page }) => {
      // Check if the Start Date input is blank
      const startDateInput = page.getByRole('textbox', { name: 'Start Date' })
      await expect(startDateInput).toHaveValue('')

      // Check if the End Date input is blank
      const endDateInput = page.getByRole('textbox', { name: 'End Date' })
      await expect(endDateInput).toHaveValue('')
    })

    test('users are able to select and apply start and end dates', async ({ page }) => {
      // Select a start date
      await page.getByRole('textbox', { name: 'Start Date' }).click()
      await page.getByRole('cell', { name: '2021' }).click()
      await page.getByRole('cell', { name: 'Mar' }).click()
      await page.getByRole('cell', { name: '5' }).first().click()

      // Select an end date
      await page.getByRole('textbox', { name: 'End Date' }).click()
      await page.getByRole('cell', { name: '2025' }).click()
      await page.getByRole('cell', { name: 'Jul' }).click()
      await page.getByRole('cell', { name: '10' }).click()
      await page.getByRole('button', {
        name: 'Apply',
        exact: true
      }).click()

      await expect(page.getByText('2021-03-05 00:00:00')).toBeVisible()
      await expect(page.getByText('2025-07-10 23:59:59')).toBeVisible()
    })

    test('clicking Today fills in the current date appropriately', async ({ page }) => {
      // Mock date with timestamp of 00:00:00
      const startDayTimestamp = moment().startOf('day')
      const mockStartDate = startDayTimestamp.format('YYYY-MM-DD HH:mm:ss')

      // Mock date with teimestamp of 23:59:59
      const endDayTimestamp = moment().endOf('day')
      const mockEndDate = endDayTimestamp.format('YYYY-MM-DD HH:mm:ss')

      await page.getByRole('textbox', { name: 'Start Date' }).click()
      await page.getByRole('button', { name: 'Today' }).click()
      await page.getByRole('textbox', { name: 'End Date' }).click()
      await page.getByRole('button', { name: 'Today' }).click()
      await page.getByRole('button', {
        name: 'Apply',
        exact: true
      }).click()

      await expect(page.getByText(mockStartDate)).toBeVisible()
      await expect(page.getByText(mockEndDate)).toBeVisible()
    })

    test.describe('when user selects Use Recurring Date', () => {
      test('default values for start and end are filled in if none are provided', async ({ page }) => {
        // Mock current date
        const currentDate = moment().endOf('day')
        const mockCurrentDate = currentDate.format('MM-DD HH:mm:ss')

        await page.getByRole('checkbox', { name: 'Use a recurring date range' }).check()

        await page.getByRole('button', {
          name: 'Apply',
          exact: true
        }).click()

        // Check that start date is automatically applied if one isn't provided
        await expect(page.getByText('01-01 00:00:00')).toBeVisible()

        // Check that the end date was defaulted to current day
        await expect(page.getByText(mockCurrentDate)).toBeVisible()

        // Check that range was applied
        await expect(page.getByText('1960 - 2025')).toBeVisible()
      })

      test('applies values for start and end when they have been selected', async ({ page }) => {
        // Select a start date
        await page.getByRole('textbox', { name: 'Start Date' }).click()
        await page.getByRole('cell', { name: '2021' }).click()
        await page.getByRole('cell', { name: 'Mar' }).click()
        await page.getByRole('cell', { name: '5' }).first().click()

        // Select an end date
        await page.getByRole('textbox', { name: 'End Date' }).click()
        await page.getByRole('cell', { name: '2025' }).click()
        await page.getByRole('cell', { name: 'Jul' }).click()
        await page.getByRole('cell', { name: '10' }).click()

        await page.getByRole('checkbox', { name: 'Use a recurring date range' }).check()
        await page.getByRole('button', {
          name: 'Apply',
          exact: true
        }).click()

        // Check that all selections have been applied
        await expect(page.getByText('03-05 00:00:00')).toBeVisible
        await expect(page.getByText('07-10 23:59:59')).toBeVisible
        await expect(page.getByText('2021 - 2025')).toBeVisible
      })
    })
  })

  test.describe('when temporal search results are recieved from edsc store', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search?qt=2021-03-04T00%3A00%3A00.000Z%2C2022-04-02T23%3A59%3A59.999Z')
      await expect(page.getByTestId('collection-results-list')).toBeVisible()
      await page.getByRole('button', { name: 'Open temporal filters' }).click()
    })

    test('search parameters are used to render dropdown menu', async ({ page }) => {
      // Check if the Start Date input is filled in
      const startDateInput = page.getByRole('textbox', { name: 'Start Date' })
      await expect(startDateInput).toHaveValue('2021-03-04 00:00:00')

      // Check if the End Date input is filled in
      const endDateInput = page.getByRole('textbox', { name: 'End Date' })
      await expect(endDateInput).toHaveValue('2022-04-02 23:59:59')
    })

    test('clicking Clear from Start DatePicker modal clears the date', async ({ page }) => {
      const startDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'Start Date' })
      const endDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'End Date' })
      await startDateInput.click()
      const startClearButton = page.getByRole('button', { name: 'Clear' }).nth(2)
      await startClearButton.click()

      // Check only start date has changed
      await expect(startDateInput).toHaveValue('')
      await expect(endDateInput).toHaveValue('2022-04-02 23:59:59')

      await endDateInput.click()
      const endClearButton = page.getByRole('button', { name: 'Clear' }).nth(2)
      await endClearButton.click()

      // Check both dates are now cleared
      await expect(startDateInput).toHaveValue('')
      await expect(endDateInput).toHaveValue('')
    })

    test('clicking Clear from End DatePicker modal clears the date', async ({ page }) => {
      const startDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'Start Date' })
      const endDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'End Date' })
      await endDateInput.click()
      const endClearButton = page.getByRole('button', { name: 'Clear' }).nth(2)
      await endClearButton.click()

      // Check only end date has changed
      await expect(startDateInput).toHaveValue('2021-03-04 00:00:00')
      await expect(endDateInput).toHaveValue('')

      await startDateInput.click()
      const startClearButton = page.getByRole('button', { name: 'Clear' }).nth(2)
      await startClearButton.click()

      // Check both dates are now cleared
      await expect(startDateInput).toHaveValue('')
      await expect(endDateInput).toHaveValue('')
    })

    test('click Clear from Temporal Dropdown clears both date values', async ({ page }) => {
      const startDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'Start Date' })
      const endDateInput = page.getByLabel('Temporal', { exact: true }).getByRole('textbox', { name: 'End Date' })

      await page.getByRole('button', {
        name: 'Clear',
        exact: true
      }).click()

      await page.getByRole('button', { name: 'Open temporal filters' }).click()

      // Check that both date values have cleared
      await expect(startDateInput).toHaveValue('')
      await expect(endDateInput).toHaveValue('')
    })
  })
})
