import { buildDataCenters } from './collectionMetadata/dataCenters'
import { buildDoi } from './collectionMetadata/doi'
import { buildGibsLayers } from './collectionMetadata/gibsLayers'
import { buildRelatedUrls } from './collectionMetadata/relatedUrls'
import { buildScienceKeywords } from './collectionMetadata/scienceKeywords'
import { buildSpatial } from './collectionMetadata/spatial'
import { buildTemporal } from './collectionMetadata/temporal'
import { buildUrls } from './collectionMetadata/buildUrls'
import CollectionRequest from './request/collectionRequest'

export const getFocusedCollectionMetadata = (collectionId, collections) => {
  if (!collections) return {}

  const collection = collections.byId[collectionId]

  if (!collection) return {}

  return {
    [collectionId]: {
      ...collection
    }
  }
}

export const createFocusedCollectionMetadata = (json, ummJson, authToken) => {
  // Metadata from the CMR .json response
  const jsonMetadata = {
    gibsLayers: buildGibsLayers(json),
    urls: buildUrls(json, authToken)
  }

  // Metadata from the CMR .umm_json response
  const ummJsonMetadata = {
    dataCenters: buildDataCenters(ummJson),
    doi: buildDoi(ummJson),
    relatedUrls: buildRelatedUrls(ummJson),
    scienceKeywords: buildScienceKeywords(ummJson),
    temporal: buildTemporal(ummJson),
    spatial: buildSpatial(ummJson)
  }

  return {
    ...jsonMetadata,
    ...ummJsonMetadata
  }
}

export const getCollectionMetadata = async (params, authToken) => {
  const requestObject = new CollectionRequest(authToken)

  // Define both the umm and ummJson requests with the correct aruguments.
  const collectionJsonRequest = () => requestObject.search(params)
  const collectionUmmRequest = () => requestObject.search(params, 'umm_json')

  return Promise.all([
    collectionJsonRequest(),
    collectionUmmRequest()
  ])
}
