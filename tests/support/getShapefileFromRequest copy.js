import busboy from 'busboy'

/**
 * Extracts the shapefile content from a multipart/form-data request
 * @param {object} request The request object containing the form data
 * @returns {Promise<string>} A promise that resolves with the shapefile content as a string
 */
export const getShapefileFromRequest = (request) => {
  // Try postDataBuffer first, fallback to postData for webkit compatibility
  let postDataBuffer = request.postDataBuffer()
  console.log('🚀 ~ getShapefileFromRequest.js:11 ~ getShapefileFromRequest ~ postDataBuffer:', postDataBuffer)

  // Webkit often returns null for postDataBuffer(), use postData() as fallback
  if (!postDataBuffer) {
    const postData = request.postData()
    if (postData) {
      postDataBuffer = Buffer.from(postData, 'utf-8')
    }
  }

  console.log('🚀 ~ getShapefileFromRequest.js:17 ~ getShapefileFromRequest ~ postDataBuffer:', postDataBuffer)
  const headers = request.headers()
  const contentType = headers['content-type']

  if (contentType && contentType.includes('multipart/form-data') && postDataBuffer) {
    return new Promise((resolve, reject) => {
      // Use busboy to parse the buffer
      const bb = busboy({ headers: { 'content-type': contentType } })

      let fileFound = false
      let capturedFileContent = null
      const formFields = {}

      // Handle file stream
      bb.on('file', (fieldname, stream, { filename, encoding, mimetype }) => {
        console.log('🚀 ~ getShapefileFromRequest.js:25 ~ getShapefileFromRequest ~ filename:', filename)
        console.log('🚀 ~ getShapefileFromRequest.js:25 ~ getShapefileFromRequest ~ encoding:', encoding)
        console.log('🚀 ~ getShapefileFromRequest.js:25 ~ getShapefileFromRequest ~ mimetype:', mimetype)
        console.log('🚀 ~ getShapefileFromRequest.js:24 ~ getShapefileFromRequest ~ fieldname:', fieldname)
        console.log('🚀 ~ getShapefileFromRequest.js:24 ~ getShapefileFromRequest ~ stream:', typeof stream)
        if (fieldname === 'shapefile') {
          fileFound = true
          const chunks = []

          stream.on('data', (data) => {
            console.log('🚀 ~ getShapefileFromRequest.js:28 ~ getShapefileFromRequest ~ data:', data)
            chunks.push(data)
          })

          stream.on('end', () => {
            capturedFileContent = Buffer.concat(chunks).toString()
          })
        } else {
          stream.resume() // Must consume the file stream for non-shapefile fields
        }
      })

      // Handle regular fields
      bb.on('field', (fieldname, val) => {
        formFields[fieldname] = val
      })

      // Handle end of parsing
      bb.on('finish', () => {
        console.log('🚀 ~ getShapefileFromRequest.js:47 ~ getShapefileFromRequest ~ fileFound:', fileFound)
        console.log('🚀 ~ getShapefileFromRequest.js:46 ~ getShapefileFromRequest ~ capturedFileContent:', capturedFileContent)
        if (fileFound && capturedFileContent !== null) {
          resolve(capturedFileContent)
        } else if (!fileFound) {
          reject(new Error('Shapefile field not found in request'))
        }
      })

      // Handle errors
      bb.on('error', (error) => {
        reject(error)
      })

      // Pipe the postDataBuffer to busboy
      bb.end(postDataBuffer)
    })
  }

  return Promise.reject(new Error('Content-Type is not multipart/form-data'))
}
