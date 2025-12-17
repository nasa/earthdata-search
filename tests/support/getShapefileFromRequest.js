import busboy from 'busboy'

/**
 * Extracts the shapefile content from a multipart/form-data request
 * @param {object} request The request object containing the form data
 * @returns {Promise<string>} A promise that resolves with the shapefile content as a string
 */
export const getShapefileFromRequest = (request) => {
  const postDataBuffer = request.postDataBuffer()
  const headers = request.headers()
  const contentType = headers['content-type']

  if (contentType && contentType.includes('multipart/form-data')) {
    return new Promise((resolve, reject) => {
      // Use busboy to parse the buffer
      const bb = busboy({ headers: { 'content-type': contentType } })

      let fileFound = false
      let capturedFileContent = null
      const formFields = {}

      // Handle file stream
      bb.on('file', (fieldname, file) => {
        if (fieldname === 'shapefile') {
          fileFound = true
          let fileContent = ''
          file.on('data', (data) => {
            fileContent += data.toString()
          })

          file.on('end', async () => {
            capturedFileContent = fileContent
          })
        } else {
          file.resume() // Must consume the file stream for non-shapefile fields
        }
      })

      // Handle regular fields
      bb.on('field', (fieldname, val) => {
        formFields[fieldname] = val
      })

      // Handle end of parsing
      bb.on('finish', () => {
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
