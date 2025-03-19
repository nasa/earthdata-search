import fs from 'fs'
import path from 'path'
import { resizeHack } from './resizeHack'

const getImageFileName = (url) => {
  let filename
  if (url.includes('arcgis.com')) {
    filename = url.split('arcgis.com/')[1].replace(/\//g, '_')
  }

  if (url.includes('earthdata.nasa.gov')) {
    filename = url.split('earthdata.nasa.gov/')[1].replace(/\//g, '_')
  }

  return filename
}

// This function can be used to download an image and save it locall to be mocked.
// eslint-disable-next-line no-unused-vars
const saveImage = async (route, page) => {
  const response = await page.request.fetch(route.request())
  const buffer = await response.body()

  const url = route.request().url()
  const filename = getImageFileName(url)
  const imagePath = path.join('./tests/fixtures/images', filename)
  fs.writeFileSync(imagePath, buffer)

  await route.continue()
}

// Return the image from disk
const mockImage = async (route) => {
  // Load the image from the file system
  const url = route.request().url()
  const filename = getImageFileName(url)
  const imagePath = path.join('./tests/fixtures/images', filename)

  try {
    const image = fs.readFileSync(imagePath)

    return route.fulfill({
      contentType: 'image/png',
      body: image
    })
  } catch {
    return route.abort()
  }
}

// Handles saving and mocking images
// eslint-disable-next-line no-unused-vars
const handleImage = async (route, page) => {
  // Uncomment this call to save images downloaded during a test
  // await saveImage(route, page)

  // Return the image from disk
  await mockImage(route)
}

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
  await page.route('**/*.{png,jpg,jpeg,pbf}', (route) => {
    // If the request for the image is from localhost, allow it to continue
    if (route.request().url().includes('localhost')) {
      route.continue()
    } else {
      route.abort()
    }
  })

  await page.route('**/arcgis/**', async (route) => {
    await handleImage(route, page)
  })

  await page.route('**/wmts.cgi**', async (route) => {
    await handleImage(route, page)
  })

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
