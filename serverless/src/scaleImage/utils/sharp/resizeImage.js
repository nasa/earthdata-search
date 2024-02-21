import sharp from 'sharp'

/**
 * Resize a given image to a given height and width
 * @param {Buffer<Image>} image An image binary contained in a buffer
 * @param {Integer|String} height image height
 * @param {Integer|String} width image width
 * @return {Buffer<Image>} Resized image or null
 */
export const resizeImage = async (image, height, width) => {
  try {
    const w = parseInt(width, 10)
    const h = parseInt(height, 10)

    // Only attempt to resize the image if a height or a width were provided
    if (height || width) {
      return await sharp(image)
        .resize(
          (w || null),
          (h || null),
          { fit: 'inside' }
        )
        .toFormat('png')
        .toBuffer()
    }

    // Default to return the full image
    return await sharp(image)
      .toFormat('png')
      .toBuffer()
  } catch (error) {
    const errorMessage = `Failed to resize image: ${error.toString()}`
    console.log(errorMessage)
    throw new Error(errorMessage)
  }
}
