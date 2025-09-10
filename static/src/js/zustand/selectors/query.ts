// @ts-expect-error The file does not have types
import snakecaseKeys from 'snakecase-keys'

import { EdscStore, GranuleQuery } from '../types'

// @ts-expect-error The file does not have types
import configureStore from '../../store/configureStore'

import {
  getCollectionSubscriptionDisabledFields,
  getGranuleSubscriptionDisabledFields
// @ts-expect-error The file does not have types
} from '../../selectors/subscriptions'

import { getCollectionId, getFocusedCollectionMetadata } from './collection'

// @ts-expect-error The file does not have types
import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'

import {
  collectionRequestNonIndexedCmrKeys,
  granuleRequestNonIndexedCmrKeys
// @ts-expect-error The file does not have types
} from '../../../../../sharedConstants/nonIndexedCmrKeys'

// @ts-expect-error The file does not have types
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'
import {
  buildGranuleSearchParams,
  extractGranuleSearchParams,
  prepareGranuleParams
// @ts-expect-error The file does not have types
} from '../../util/granules'
// @ts-expect-error The file does not have types
import { prepareSubscriptionQuery, removeDisabledFieldsFromQuery } from '../../util/subscriptions'

/**
 * Retrieve current collection query information for collection searches
 */
export const getCollectionsQuery = (state: EdscStore) => state.query?.collection || {}

/**
 * Retrieve NLP collection data
 */
export const getNlpCollection = (state: EdscStore) => state.query?.nlpCollection || null

/**
 * Retrieve NLP spatial data
 */
export const getNlpSpatialData = (state: EdscStore) => {
  const nlpCollection = getNlpCollection(state)

  return nlpCollection?.spatial || null
}

/**
 * Retrieve NLP temporal data
 */
export const getNlpTemporalData = (state: EdscStore) => {
  const nlpCollection = getNlpCollection(state)

  return nlpCollection?.temporal || null
}

/**
 * Retrieve current collection spatial information
 */
export const getCollectionsQuerySpatial = (state: EdscStore) => {
  const { spatial } = getCollectionsQuery(state)

  return {
    boundingBox: [],
    circle: [],
    line: [],
    point: [],
    polygon: [],
    ...spatial
  }
}

/**
 * Retrieve the selected region query object
 */
export const getSelectedRegionQuery = (state: EdscStore) => state.query.selectedRegion

/**
 * Retrieve current collection temporal information
 */
export const getCollectionsQueryTemporal = (state: EdscStore) => {
  const { temporal } = getCollectionsQuery(state)

  return temporal
}

/**
 * Retrieve query information pertaining to the focused collection id
 */
export const getFocusedCollectionGranuleQuery = (state: EdscStore): GranuleQuery => {
  const focusedCollectionId = getCollectionId(state)

  if (!focusedCollectionId) return {} as GranuleQuery

  const { byId: collectionsQueryById = {} } = getCollectionsQuery(state)

  const collectionQuery = collectionsQueryById[focusedCollectionId]

  return collectionQuery?.granules || {}
}

/**
 * Retrieve the granule subscription query object
 */
export const getGranuleSubscriptionQueryObj = (state: EdscStore) => {
  const collectionMetadata = getFocusedCollectionMetadata(state)
  const { id: collectionId } = collectionMetadata

  const extractedGranuleParams = extractGranuleSearchParams(collectionId)

  const granuleParams = prepareGranuleParams(
    collectionMetadata,
    extractedGranuleParams
  )

  const searchParams = buildGranuleSearchParams(granuleParams)
  const subscriptionQuery = prepareSubscriptionQuery(searchParams)

  return subscriptionQuery
}

/**
 * Retrieve the granule subscription query string
 */
export const getGranuleSubscriptionQueryString = (state: EdscStore) => {
  const { getState: reduxGetState } = configureStore()
  const disabledFields = getGranuleSubscriptionDisabledFields(reduxGetState())

  const queryObj = getGranuleSubscriptionQueryObj(state)

  const queryWithDisabledRemoved = removeDisabledFieldsFromQuery(queryObj, disabledFields)

  const params = prepKeysForCmr(
    snakecaseKeys(queryWithDisabledRemoved),
    granuleRequestNonIndexedCmrKeys
  )

  return params
}

/**
 * Retrieve the collection subscription query object
 */
export const getCollectionSubscriptionQueryObj = () => {
  const { getState: reduxGetState } = configureStore()
  const collectionParams = prepareCollectionParams(reduxGetState())

  const searchParams = buildCollectionSearchParams(collectionParams)
  const subscriptionQuery = prepareSubscriptionQuery(searchParams)

  return subscriptionQuery
}

/**
 * Retrieve the collection subscription query string
 */
export const getCollectionSubscriptionQueryString = () => {
  const { getState: reduxGetState } = configureStore()
  const disabledFields = getCollectionSubscriptionDisabledFields(reduxGetState())

  const queryObj = getCollectionSubscriptionQueryObj()

  const queryWithDisabledRemoved = removeDisabledFieldsFromQuery(queryObj, disabledFields)
  const params = prepKeysForCmr(
    snakecaseKeys(queryWithDisabledRemoved),
    collectionRequestNonIndexedCmrKeys
  )

  return params
}
