import { hasTag } from '../../../../../sharedUtils/tags'
import { fetchGiovanniHandoffUrl } from './giovanni'
import { fetchOpenAltimetryHandoffUrl } from './openAltimetry'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} collectionMetadata Collection metadata from CMR
 * @param {Object} collectionQuery Collection Search data from Redux
 */
export const generateHandoffs = (collectionMetadata, collectionQuery, mapProjection) => {
  const handoffLinks = []

  // Giovanni Handoff
  if (hasTag(collectionMetadata, 'handoff.giovanni', 'edsc.extra')) {
    handoffLinks.push(fetchGiovanniHandoffUrl(collectionMetadata, collectionQuery))
  }

  // Open Altimetry Handoff
  if (hasTag(collectionMetadata, 'handoff.open_altimetry', 'edsc.extra')) {
    handoffLinks.push(
      fetchOpenAltimetryHandoffUrl(collectionMetadata, collectionQuery, mapProjection)
    )
  }


  return handoffLinks
}

export default generateHandoffs
