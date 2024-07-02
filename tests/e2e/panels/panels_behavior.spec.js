import { test, expect } from '@playwright/test'
import singleCollection from './__mocks__/single_collection.json'

const dragPanelToX = async (page, x) => {
  const handle = page.locator('[data-testid="panels__handle"]')
  await handle.hover()
  await handle.dispatchEvent('mousedown', { button: 0 })
  await handle.dispatchEvent('mousemove', { clientX: x })
  await handle.dispatchEvent('mouseup', { button: 0 })
}

test.describe('Panel Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/search/collections.json', (route) => {
      route.fulfill({
        body: JSON.stringify(singleCollection.body),
        headers: singleCollection.headers
      })
    })

    await page.goto('/')
  })

  test('is present by default on page load', async ({ page }) => {
    await expect(page.locator('.panels--is-open')).toHaveCount(1)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(0)

    await expect(page.locator('.panels__handle')).toBeVisible()
  })

  test('opens and closes when clicking the handle', async ({ page }) => {
    await page.locator('.panels__handle').click()

    await expect(page.locator('.panels--is-open')).toHaveCount(0)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(1)

    await page.locator('.panels__handle').click()

    await expect(page.locator('.panels--is-open')).toHaveCount(1)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(0)
  })

  test('opens and closes when using keyboard shortcuts', async ({ page }) => {
    await page.keyboard.press(']')

    await expect(page.locator('.panels--is-open')).toHaveCount(0)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(1)

    await page.keyboard.press(']')

    await expect(page.locator('.panels--is-open')).toHaveCount(1)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(0)
  })

  test('drags the panel to a specific width', async ({ page }) => {
    await dragPanelToX(page, 100)

    await expect(page.getByTestId('panels-section')).toHaveCSS('width', '700px')
  })

  test('drags the panel to closed', async ({ page }) => {
    await dragPanelToX(page, -1500)

    await expect(page.locator('.panels--is-open.panels--will-minimize').length).toEqual(1)
  })

  test('drags the panel to open from being closed', async ({ page }) => {
    await page.locator('.panels__handle').click()

    await expect(page.locator('.panels--is-open')).toHaveCount(0)
    await expect(page.locator('.panels--is-minimized')).toHaveCount(1)

    await dragPanelToX(page, 570)

    await expect(page.getByTestId('panels-section')).toHaveCSS('width', '570px')
    await expect(page.locator('.panels--is-open')).toHaveCount(1)
  })

  test('drags the panel to maximum width', async ({ page }) => {
    await dragPanelToX(page, 1500)

    await expect(page.getByTestId('panels-section')).toHaveCSS('width', '1035px')
  })
})
