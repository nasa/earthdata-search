import sharp from 'sharp'
import { resizeImage } from './resizeImage'
import notFoundAsset from './image-unavailable.svg'

// ../../assets/images/image-unavailable.svg
/**
 * No image available? This will pull the svg file and return it as a Buffer
 const notFoundAsset = require('./image-unavailable.svg')
 * @return {Buffer<Image>} This is what you show the user when an image cannot be found or resized
 */
export const buildUnavailableImageBuffer = async (height = null, width = null) => {
  console.log('Not converted type', typeof (notFoundAsset))
  // Sharp svgs must be buffers
  const notFoundPass = Buffer.from(notFoundAsset)
  if (height || width) {
    return resizeImage(notFoundPass, height, width)
  }

  console.log('converted type', typeof (notFoundPass))
  const notFound = await sharp(notFoundPass)
    .toFormat('png')
    .toBuffer()

  return notFound
}
