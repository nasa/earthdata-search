import axios from 'axios'
import { requestTimeout } from '../../util/requestTimeout'

/**
 * Fetches images from a given url and returns them as a buffer
 * @param {String} imageUrl URl to an image pulled from the metadata of a CMR concept
 * @returns {Buffer<Image>} The image contained in a buffer
 */
export const downloadImageFromSource = async (imageUrl) => {
  try {
    // Retrieve image data from external url and ensure timeout is less than lambda timeout
    const response = await axios({
      url: imageUrl,
      method: 'get',
      responseType: 'arraybuffer',
      timeout: requestTimeout()
    })
    const { data } = response

    return data
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching image from url ${imageUrl}, ${errorMessage}`)

    return undefined
  }
}
