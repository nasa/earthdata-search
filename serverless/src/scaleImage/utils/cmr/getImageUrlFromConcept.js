import { fetchCmrCollectionGranules } from './fetchCmrCollectionGranules'
import { fetchCmrConcept } from './fetchCmrConcept'
import { getBrowseImageUrlFromConcept } from './getBrowseImageUrlFromConcept'
/**
 * Call appropriate method given concept type to extract image url from metadata
 * @param {String} conceptId CMR concept id
 * @param {String} conceptType CMR concept type
 * @param {String} cascadeConcepts Whether or not to check granules if collection metadata contains no browse image urls
 * @param {String} imageSrc optionally passing the url for the image we need to retrieve, used for granules
 * @returns {String} Url to an image or null
 */
export const getImageUrlFromConcept = async (
  conceptId,
  conceptType,
  cascadeConcepts,
  imageSrc
) => {
  // Retrieve the metadata for the provided concept id and type
  const conceptMetadata = await fetchCmrConcept(conceptId)

  if (conceptType === 'granules') {
    // If the `imgSrc` was included in the request then we should search for that one
    if (imageSrc) {
      return imageSrc
    }

    return getBrowseImageUrlFromConcept(conceptMetadata)
  }

  // TODO are we still going to support things called datasets?
  // Support previously used names for collections
  if (['collections', 'datasets'].includes(conceptType)) {
    let collectionBrowseImage = await getBrowseImageUrlFromConcept(conceptMetadata)
    // If no browse image was found in the collection metadata and the user wants to fallback to granule metadata
    if (collectionBrowseImage == null && cascadeConcepts === 'true') {
      const collectionGranuleMetadata = await fetchCmrCollectionGranules(conceptId)

      collectionGranuleMetadata.some((granuleMetadata) => {
        // If we find a browsable image break out of loop and set it equal to the collection image
        const granuleBrowseImageUrl = getBrowseImageUrlFromConcept(granuleMetadata)
        collectionBrowseImage = granuleBrowseImageUrl

        // TODO remove me useful for testing
        if (granuleBrowseImageUrl) {
          console.log('🚀We have defaulted to using the granule image for the thumbnail')
        }

        return granuleBrowseImageUrl
      })
    }

    return collectionBrowseImage
  }

  // Concept was not collection or granule
  console.log(`Unable to find browse imagery for concept: ${conceptId}`)

  return null
}
