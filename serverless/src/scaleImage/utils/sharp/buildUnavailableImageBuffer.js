import sharp from 'sharp'
import { resizeImage } from './resizeImage'

/**
 * No image available? This will pull the svg file and return it as a Buffer
 * @return {Buffer<Image>} This is what you show the user when an image cannot be found or resized
 */
export const buildUnavailableImageBuffer = async (height = null, width = null) => {
  // Const noFoundAsset = '../../../../../static/src/assets/images/image-unavailable.svg'

  const noFoundAsset = 'static/src/assets/images/image-unavailable.svg'
  if (height || width) {
    return resizeImage(noFoundAsset, height, width)
  }

  const notFound = await sharp(noFoundAsset)
    .toFormat('png')
    .toBuffer()

  return notFound
}
