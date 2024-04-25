import sharp from 'sharp'
import { resizeImage } from './resizeImage'

import notFoundAsset from '../../../../../static/src/assets/images/image-unavailable.svg'

/**
 * No image available? This will pull the svg file and return it as a Buffer
 * @return {Buffer<Image>} This is what you show the user when an image cannot be found or resized
 */
export const buildUnavailableImageBuffer = async (height = null, width = null) => {
  if (height || width) {
    return resizeImage(notFoundAsset, height, width)
  }

  const notFound = await sharp(notFoundAsset)
    .toFormat('png')
    .toBuffer()

  return notFound
}
