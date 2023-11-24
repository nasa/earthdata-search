import { buildUnavailableImageBuffer } from './buildUnavailableImageBuffer'
import { resizeImage } from './resizeImage'

/**
 * Resize the unavailable image to a given height and width
 * @param {Integer} height Desired height of output image
 * @param {Integer} width Desired width of output image
 * @return {Buffer<Image>} The image buffer, resized
 */
export const buildAndResizeUnavailableImageBuffer = async (height, width) => {
  // Avoid calling resize if no dimensions were provided
  if (height || width) {
    console.log('resizing empty image')

    return resizeImage('static/src/assets/images/image-unavailable.svg', height, width)
  }

  return buildUnavailableImageBuffer()
}
