import { isEmpty } from 'lodash'

import { buildDataCenters } from './collectionMetadata/dataCenters'
import { buildDirectDistributionInformation } from './collectionMetadata/buildDirectDistributionInformation'
import { buildDoi } from './collectionMetadata/doi'
import { buildDuplicateCollections } from './collectionMetadata/buildDuplicateCollections'
import { buildGibsLayers } from './collectionMetadata/buildGibsLayers'
import { buildRelatedUrls } from './collectionMetadata/relatedUrls'
import { buildScienceKeywords } from './collectionMetadata/scienceKeywords'
import { buildSpatial } from './collectionMetadata/spatial'
import { buildTemporal } from './collectionMetadata/temporal'
import { buildUrls } from './collectionMetadata/buildUrls'

/**
 * Returns the collection object from the metadata store for the provided collectionId
 * @param {String} collectionId Focused collection id
 * @param {Object} collections collections from the metadata store
 */
export const getCollectionMetadata = (collectionId, collections) => {
  if (isEmpty(collections)) return undefined

  const { [collectionId]: collectionMetadata = {} } = collections

  return collectionMetadata
}

/**
 * Format fetched metadata for the UI
 * @param {Object} metadata Collection metadata
 * @param {String} authToken The authenticated user's JWT token
 */
export const createFocusedCollectionMetadata = (metadata, authToken, earthdataEnvironment) => ({
  gibsLayers: buildGibsLayers(metadata),
  urls: buildUrls(metadata, authToken, earthdataEnvironment),
  dataCenters: buildDataCenters(metadata),
  directDistributionInformation: buildDirectDistributionInformation(metadata),
  doi: buildDoi(metadata),
  duplicateCollections: buildDuplicateCollections(metadata),
  relatedUrls: buildRelatedUrls(metadata),
  scienceKeywords: buildScienceKeywords(metadata),
  temporal: buildTemporal(metadata),
  spatial: buildSpatial(metadata)
})
