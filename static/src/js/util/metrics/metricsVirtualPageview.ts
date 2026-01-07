import {
  computeKeyword,
  computeSpatialType,
  computeTemporalType,
  computeCollectionsViewed,
  computeCollectionsAdded,
  computeFacets
} from './helpers'

const { dataLayer = [] } = window

/**
* Pushes a virtualPageView event on the dataLayer. Only fires on PUSH events.
* These `PUSH` events only fire during page transitions
* @param {string} navigationType The type of navigation event (PUSH, POP, REPLACE)
*/
export const metricsVirtualPageview = (navigationType: string) => {
  if (navigationType === 'PUSH') {
    dataLayer.push({
      event: 'virtualPageView',
      dimension11: computeKeyword(), // Keyword Search
      dimension12: computeSpatialType(), // Spatial
      dimension13: computeTemporalType(), // Temporal
      dimension14: computeCollectionsViewed(), // Collections Viewed
      dimension15: computeCollectionsAdded(), // Collections Added
      dimension16: computeFacets() // Search Facet
    })
  }
}
