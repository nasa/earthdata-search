/**
 * Sets up Playwright tests to prevent loading the map and disable the tour by default.
 * @param {object} options - The options for setting up the test environment.
 * @param {Page} options.page - The Playwright page instance.
 * @param {BrowserContext} options.context - The Playwright context for the test.
 * @param {boolean} [options.dontShowTour=true] - A flag to prevent the tour from starting.
 */
export const setupTests = async ({ page, context, dontShowTour = true }) => {
  // Set the 'dontShowTour' flag in localStorage
  await context.addInitScript((value) => {
    const previousValue = window.localStorage.getItem('dontShowTour')

    // If we already provided a value, we don't want to overwrite any changes that have been made
    if (previousValue) return

    window.localStorage.setItem('dontShowTour', value)
  }, dontShowTour.toString())

  // Prevent loading of images and map tiles to speed up tests
  await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
  await page.route('**/scale/**', (route) => route.abort())

  // Mock requests to the status app
  await page.route(/status\.earthdata\.nasa\.gov/, (route) => route.fulfill({
    status: 200,
    json: '{"success":true,"notifications":[]}'
  }))
}
