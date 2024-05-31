import { test } from 'playwright-test-coverage'

test('Capture homepage load times', async ({ page }) => {
  const requestFinishedPromise = page.waitForEvent('requestfinished')
  await page.goto('/search')
  const request = await requestFinishedPromise
  console.log(request.timing())
})
