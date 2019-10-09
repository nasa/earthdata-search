import { hasTag } from '../../../../../sharedUtils/tags'
import fetchGiovanniHandoffUrl from './giovanni'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} collectionMetadata Collection metadata from CMR
 * @param {Object} collectionSearch Collection Search data from Redux
 */
export const generateHandoffs = (collectionMetadata, collectionSearch) => {
  const handoffLinks = []

  // Giovanni Handoff
  if (hasTag(collectionMetadata, 'handoff.giovanni', 'edsc.extra')) {
    handoffLinks.push(fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch))
  }

  return handoffLinks
}

export default generateHandoffs
