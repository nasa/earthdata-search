import { readFileSync } from 'fs'

// https://github.com/microsoft/playwright/issues/10667#issuecomment-998397241
const uploadShapefile = async (page, filename) => {
  const buffer = readFileSync(`./tests/fixtures/shapefiles/${filename}`)

  await page.route(/convert/, async (route) => {
    await route.fulfill({
      // json: buffer,
      body: buffer,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })
  })

  // Create the DataTransfer and File
  // const dataTransfer = await scope.page.evaluateHandle((data) => {
  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer()
    // Convert the buffer to a hex array
    const file = new File([data.toString('hex')], 'test.geojson', { type: 'application/json' })
    dt.items.add(file)
    return dt
  }, buffer)

  // Now dispatch
  await page.dispatchEvent('.shapefile-dropzone', 'drop', { dataTransfer })
}

export default uploadShapefile
