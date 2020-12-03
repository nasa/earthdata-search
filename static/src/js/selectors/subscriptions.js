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
 * Retrieve metadata from Redux pertaining to subscriptions
 */
export const getSubscriptionsByCollectionId = createSelector(
  [getSubscriptions],
  (subscriptionsMetadata) => {
    const byCollectionConceptId = {}

    const { byId } = subscriptionsMetadata

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
