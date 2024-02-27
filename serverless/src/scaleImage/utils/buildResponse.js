/**
 * Constructs a response body
 * @param {Buffer<Image>} imageBuffer Image buffer to return as the body
 * @param {Integer>} statusCode Status code to return with the response
 * @returns {JSON} Constructed response object with image as a base64 string
 */
// eslint-disable-next-line no-unused-vars
export const buildResponse = (imageBuffer, statusCode = 200) => {
  const base64Image = imageBuffer.toString('base64')

  // Client must send an Accept header who's 1st media type matches what you have set as a binary media types in API Gateway
  return {
    statusCode,
    headers: {
      'Content-type': 'image/png',
      'Access-Control-Allow-Origin': '*'
    },
    body: base64Image,
    isBase64Encoded: true
  }
}
