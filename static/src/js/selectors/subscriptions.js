import { createSelector } from 'reselect'

/**
 * Retrieve all subscription metadata from Redux
 * @param {Object} state Current state of Redux
 */
export const getSubscriptions = (state) => {
  const { subscriptions = {} } = state

  return subscriptions
}

/**
 * Retrieve metadata from Redux pertaining to granule subscriptions
 */
export const getSubscriptionsByCollectionId = createSelector(
  [getSubscriptions],
  (subscriptionsMetadata) => {
    const byCollectionConceptId = {}

    const { byId = {} } = subscriptionsMetadata

    Object.values(byId).forEach((subscription) => {
      const { collectionConceptId } = subscription

      const { [collectionConceptId]: existingSubscriptions = [] } = byCollectionConceptId

      byCollectionConceptId[collectionConceptId] = [
        ...existingSubscriptions,
        subscription
      ]
    })

    return byCollectionConceptId
  }
)

/**
 * Retrieve metadata from Redux pertaining to collection subscriptions
 * @param {Object} state Current state of Redux
 */
export const getCollectionSubscriptions = createSelector(
  [getSubscriptions],
  (subscriptionsMetadata) => {
    const { byId = {} } = subscriptionsMetadata

    return Object.values(byId).map((subscription) => subscription)
  }
)

/**
 * Retrieve metadata from Redux pertaining to collection subscription enabled fields
 */
export const getCollectionSubscriptionDisabledFields = createSelector(
  [getSubscriptions],
  (subscriptionMetadata) => {
    const { disabledFields } = subscriptionMetadata
    const { collection } = disabledFields

    return collection
  }
)

/**
 * Retrieve metadata from Redux pertaining to granule subscription enabled fields
 */
export const getGranuleSubscriptionDisabledFields = createSelector(
  [getSubscriptions],
  (subscriptionMetadata) => {
    const { disabledFields } = subscriptionMetadata
    const { granule } = disabledFields

    return granule
  }
)
