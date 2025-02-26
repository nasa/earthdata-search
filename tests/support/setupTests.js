import { resizeHack } from './resizeHack'

/**
 * Sets up Playwright tests to prevent loading the map and disable the tour by default.
 * @param {object} options - The options for setting up the test environment.
  * @param {string} [options.browserName=false] - The name of the browser being used.
 * @param {BrowserContext} options.context - The Playwright context for the test.
 * @param {boolean} [options.dontShowTour=true] - A flag to prevent the tour from starting.
 * @param {Page} options.page - The Playwright page instance.
 */
export const setupTests = async ({
  browserName = false,
  context,
  dontShowTour = true,
  page
}) => {
  // Set the 'dontShowTour' flag in localStorage
  await context.addInitScript((value) => {
    const previousValue = window.localStorage.getItem('dontShowTour')

    // If we already provided a value, we don't want to overwrite any changes that have been made
    if (previousValue) return

    window.localStorage.setItem('dontShowTour', value)
  }, dontShowTour.toString())

  // Prevent loading of images and map tiles to speed up tests
  await page.route('**/*.{png,jpg,jpeg,pbf}', (route) => route.abort())
  await page.route('**/arcgis/**', (route) => route.abort())
  await page.route('**/scale/**', (route) => route.abort())

  // Mock requests to the status app
  await page.route(/status\.earthdata\.nasa\.gov/, (route) => route.fulfill({
    status: 200,
    json: '{"success":true,"notifications":[]}'
  }))

  if (browserName) {
    page.on('domcontentloaded', async () => {
      await resizeHack(page, browserName)
    })
  }
}
