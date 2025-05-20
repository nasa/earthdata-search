type ImagePath = string

type HeroImageSrcSetReturnValue = {
  preloadSrcSet: string
  preloadSizes: string
}

/**
 * Generates a `srcSet` attribute and `sizes` attribute for Home page hero images
 */
const getHeroImageSrcSet = (imagePaths: ImagePath[]): HeroImageSrcSetReturnValue => {
  const srcSetSizeList = [
    '800w',
    '1600w',
    '1280w',
    '1920w',
    '2560w',
    '3840w',
    '5120w'
  ]

  const preloadSrcSet = imagePaths.map(
    (imagePath, index) => `${imagePath} ${srcSetSizeList[index]}`
  ).join(', ')

  const preloadSizes = `(max-width: 800px) 800px,
                        (max-width: 1280px) 1280px,
                        (max-width: 1920px) 1920px,
                        2560px`

  return {
    preloadSrcSet,
    preloadSizes
  }
}

export default getHeroImageSrcSet
