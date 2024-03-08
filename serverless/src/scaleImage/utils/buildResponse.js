/**
 * Constructs a response body
 * @param {Buffer<Image>} imageBuffer Image buffer to return as the body
 * @param {Integer>} statusCode Status code to return with the response
 * @returns {JSON} Constructed response object with image as a base64 string
 */
// eslint-disable-next-line no-unused-vars
export const buildResponse = (imageBuffer, statusCode = 200) => {
  console.log('🚀 ~ file: buildResponse.js:9 ~ buildResponse ~ imageBuffer:', imageBuffer)
  // TODO what if we just return it as binary
  // eslint-disable-next-line no-unused-vars
  const base64Image = imageBuffer.toString('base64')
  // Return the image as a binary Buffer
  // Not base64 encoding the image to avoid needing to alter the `binary media` types of the API-GWY
  // Altering those binary media types to `*/*` would be needed because we cannot anticipate the `mime-type` that the
  // Request `Accept` header has since the request is being made by our <img> elements
  // Setting the binary media type to `*/*` for the API GWY has unintended side effects on the other lambdas and so should be avoided

  return {
    statusCode,
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*'
    },
    body: imageBuffer,
    isBase64Encoded: true
  }
}
