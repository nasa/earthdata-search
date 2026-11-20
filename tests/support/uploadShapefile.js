import { readFileSync } from 'fs'

// https://github.com/microsoft/playwright/issues/10667#issuecomment-998397241
const uploadShapefile = async (page, filename) => {
  const buffer = readFileSync(`./tests/fixtures/shapefiles/${filename}`)

  await page.route(/shapefile_upload_url/, async (route) => {
    await route.fulfill({
      json: {
        expiresIn: 300,
        key: '3391ec5c-eb9a-49ee-b487-ef51c2cbe6d5/test.geojson',
        url: 'http://localhost:4569/earthdata-search-dev-shapefile-upload/3391ec5c-eb9a-49ee-b487-ef51c2cbe6d5/test.geojson?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=S3RVER%2F20261120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261120T011803Z&X-Amz-Expires=300&X-Amz-Signature=8c61fad27065f55531139823647bde2fe3834ad68190e1e5402f880c1a5315dd&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject'
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })
  })

  await page.route(/test\.geojson/, async (route) => {
    await route.fulfill()
  })

  await page.route(/convert_shapefile/, async (route) => {
    await route.fulfill({
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
