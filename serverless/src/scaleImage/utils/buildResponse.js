/**
 * Constructs a response body
 * @param {Buffer<Image>} imageBuffer Image buffer to return as the body
 * @param {Integer>} statusCode Status code to return with the response
 * @returns {JSON} Constructed response object with image as a base64 string
 */
// eslint-disable-next-line no-unused-vars
export const buildResponse = (imageBuffer, statusCode = 200) => {
  // TODO what if we just return it as binary
  // eslint-disable-next-line no-unused-vars
  const base64Image = imageBuffer.toString('base64')
  const responseImg = `data:image/png;base64, ${base64Image}`

  console.log('🚀 ~ file: buildResponse.js:15 ~ buildResponse ~ responseImg:', responseImg)
  // Return the image as a binary Buffer
  // Not base64 encoding the image to avoid needing to alter the `binary media` types of the API-GWY
  // Altering those binary media types to `*/*` would be needed because we cannot anticipate the `mime-type` that the
  // Request `Accept` header has since the request is being made by our <img> elements
  // Setting the binary media type to `*/*` for the API GWY has unintended side effects on the other lambdas and so should be avoided
  // return {
  //   statusCode,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   },
  //   body: responseImg,
  //   isBase64Encoded: false
  // }

  // return {
  //   statusCode,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*'
  //   },
  //   body: JSON.stringify({
  //     data: responseImg,
  //     'content-type': 'image/png'
  //   }),
  //   isBase64Encoded: false
  // }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      base64Image
    }),
    isBase64Encoded: false
  }

  // return {
  //   statusCode,
  //   headers: {
  //     'Content-type': 'text/json',
  //     'Access-Control-Allow-Origin': '*'
  //   },
  //   data: responseImg,
  //   isBase64Encoded: false
  // }
}
