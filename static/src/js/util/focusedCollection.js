import { isEmpty } from 'lodash'

import { buildDataCenters } from './collectionMetadata/dataCenters'
import { buildDoi } from './collectionMetadata/doi'
import { buildGibsLayers } from './collectionMetadata/gibsLayers'
import { buildRelatedUrls } from './collectionMetadata/relatedUrls'
import { buildScienceKeywords } from './collectionMetadata/scienceKeywords'
import { buildSpatial } from './collectionMetadata/spatial'
import { buildTemporal } from './collectionMetadata/temporal'
import { buildUrls } from './collectionMetadata/buildUrls'
import CollectionRequest from './request/collectionRequest'
import { buildNativeFormat } from './collectionMetadata/nativeFormat'


/**
 * Returns the collection object from the metadata store for the provided collectionId
 * @param {String} collectionId Focused collection id
 * @param {Object} collections collections from the metadata store
 */
export const getFocusedCollectionObject = (collectionId, collections) => {
  if (isEmpty(collections)) return undefined
  const { byId = {} } = collections

  return byId[collectionId] || {}
}

/**
 * Returns the json metadata from the store for the provided collectionId
 * @param {String} collectionId Focused collection id
 * @param {Object} collections collections from the metadata store
 */
export const getFocusedCollectionMetadata = (collectionId, collections) => {
  const collection = getFocusedCollectionObject(collectionId, collections)
  if (isEmpty(collection)) return undefined
  const { metadata = {} } = collection

  return metadata
}

/**
 * Returns the formattedjson metadata from the store for the provided collectionId
 * @param {String} collectionId Focused collection id
 * @param {Object} collections collections from the metadata store
 */
export const getFocusedCollectionFormattedMetadata = (collectionId, collections) => {
  const collection = getFocusedCollectionObject(collectionId, collections)

  if (isEmpty(collection)) return undefined

  const { formattedMetadata } = collection
  return formattedMetadata
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
    nativeFormats: buildNativeFormat(ummJson),
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
