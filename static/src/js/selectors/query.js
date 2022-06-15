import snakecaseKeys from 'snakecase-keys'
import { createSelector } from 'reselect'

import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { buildGranuleSearchParams, extractGranuleSearchParams, prepareGranuleParams } from '../util/granules'
import { prepareSubscriptionQuery, removeDisabledFieldsFromQuery } from '../util/subscriptions'
import { prepKeysForCmr } from '../../../../sharedUtils/prepKeysForCmr'
import { collectionRequestNonIndexedCmrKeys, granuleRequestNonIndexedCmrKeys } from '../../../../sharedConstants/nonIndexedCmrKeys'

import { getFocusedCollectionId } from './focusedCollection'
import { getFocusedCollectionMetadata } from './collectionMetadata'
import { getCollectionSubscriptionDisabledFields, getGranuleSubscriptionDisabledFields } from './subscriptions'

/**
 * Retrieve current collection query information from Redux
 * @param {Object} state Current state of Redux
 */
export const getCollectionsQuery = (state) => {
  const { query = {} } = state
  const { collection = {} } = query

  return collection
}

/**
 * Retrieve query information from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionGranuleQuery = createSelector(
  [getFocusedCollectionId, getCollectionsQuery],
  (focusedCollectionId, collectionsQuery) => {
    const { byId: collectionsQueryById = {} } = collectionsQuery
    const { [focusedCollectionId]: collectionQuery = {} } = collectionsQueryById
    const { granules: collectionGranuleQuery = {} } = collectionQuery

    return collectionGranuleQuery
  }
)

/**
 * Retrieve the granule subscription query object
 * @param {Object} state Current state of Redux
 */
export const getGranuleSubscriptionQueryObj = createSelector(
  [(state) => state, getFocusedCollectionMetadata],
  (state, collectionMetadata) => {
    const { id: collectionId } = collectionMetadata
    // Extract granule search parameters from redux specific to the focused collection
    const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

    const granuleParams = prepareGranuleParams(
      collectionMetadata,
      extractedGranuleParams
    )

    const searchParams = buildGranuleSearchParams(granuleParams)

    const subscriptionQuery = prepareSubscriptionQuery(searchParams)

    return subscriptionQuery
  }
)

/**
 * Retrieve the granule subscription query string
 * @param {Object} state Current state of Redux
 */
export const getGranuleSubscriptionQueryString = (state) => {
  const queryObj = getGranuleSubscriptionQueryObj(state)
  const disabledFields = getGranuleSubscriptionDisabledFields(state)

  const queryWithDisabledRemoved = removeDisabledFieldsFromQuery(queryObj, disabledFields)

  const params = prepKeysForCmr(
    snakecaseKeys(queryWithDisabledRemoved),
    granuleRequestNonIndexedCmrKeys
  )

  return params
}

/**
 * Retrieve the collection subscription query object
 * @param {Object} state Current state of Redux
 */
export const getCollectionSubscriptionQueryObj = (state) => {
  const collectionParams = prepareCollectionParams(state)
  const searchParams = buildCollectionSearchParams(collectionParams)
  const subscriptionQuery = prepareSubscriptionQuery(searchParams)

  return subscriptionQuery
}

/**
 * Retrieve the collection subscription query string
 * @param {Object} state Current state of Redux
 */
export const getCollectionSubscriptionQueryString = (state) => {
  const queryObj = getCollectionSubscriptionQueryObj(state)
  const disabledFields = getCollectionSubscriptionDisabledFields(state)

  const queryWithDisabledRemoved = removeDisabledFieldsFromQuery(queryObj, disabledFields)
  const params = prepKeysForCmr(
    snakecaseKeys(queryWithDisabledRemoved),
    collectionRequestNonIndexedCmrKeys
  )

  return params
}
