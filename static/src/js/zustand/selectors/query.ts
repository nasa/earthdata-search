// @ts-expect-error The file does not have types
import snakecaseKeys from 'snakecase-keys'

import { EdscStore } from '../types'

// @ts-expect-error The file does not have types
import configureStore from '../../store/configureStore'

// @ts-expect-error The file does not have types
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
// @ts-expect-error The file does not have types
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import {
  getCollectionSubscriptionDisabledFields,
  getGranuleSubscriptionDisabledFields
// @ts-expect-error The file does not have types
} from '../../selectors/subscriptions'

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
 * Retrieve current collection query information
 */
export const getCollectionsQuery = (state: EdscStore) => state.query?.collection || {}

/**
 * Retrieve current collection spatial information
 */
export const getCollectionsQuerySpatial = (state: EdscStore) => {
  const { spatial } = getCollectionsQuery(state)

  return spatial
}

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
export const getFocusedCollectionGranuleQuery = (state: EdscStore) => {
  const { getState: reduxGetState } = configureStore()
  const focusedCollectionId = getFocusedCollectionId(reduxGetState())

  const { byId: collectionsQueryById = {} } = getCollectionsQuery(state)

  const collectionQuery = collectionsQueryById[focusedCollectionId]

  return collectionQuery?.granules || {}
}

/**
 * Retrieve the granule subscription query object
 */
export const getGranuleSubscriptionQueryObj = () => {
  const { getState: reduxGetState } = configureStore()
  const reduxState = reduxGetState()
  const collectionMetadata = getFocusedCollectionMetadata(reduxState)
  const { id: collectionId } = collectionMetadata

  // Extract granule search parameters from redux specific to the focused collection
  const extractedGranuleParams = extractGranuleSearchParams(reduxState, collectionId)

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
export const getGranuleSubscriptionQueryString = () => {
  const { getState: reduxGetState } = configureStore()
  const disabledFields = getGranuleSubscriptionDisabledFields(reduxGetState())

  const queryObj = getGranuleSubscriptionQueryObj()

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
