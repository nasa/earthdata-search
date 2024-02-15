import axios from 'axios'

/**
 * Fetches images from a given url and returns them as a buffer
 * @param {String} imageUrl URl to an image pulled from the metadata of a CMR concept
 * @returns {Buffer<Image>} The image contained in a buffer
 */
export const downloadImageFromSource = async (imageUrl) => {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'get',
      responseType: 'arraybuffer'
    })
    const { data } = response

    return data
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching granules from cmr to set a thumbnail ${errorMessage}`)

    return undefined
  }
}
