/**
 * Sets up Playwright tests to not load the map or start the tour by default
 */
export const setupTests = async (page, context, dontShowTour = true) => {
  await context.addInitScript((value) => {
    window.localStorage.setItem('dontShowTour', value)
  }, dontShowTour.toString())

  await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
  await page.route('**/scale/**', (route) => route.abort())
}
