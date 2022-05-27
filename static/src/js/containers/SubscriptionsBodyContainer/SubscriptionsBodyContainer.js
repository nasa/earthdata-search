import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import { getCollectionSubscriptionQueryString, getGranuleSubscriptionQueryString } from '../../selectors/query'
import { getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'
import { getCollectionSubscriptions } from '../../selectors/subscriptions'

import SubscriptionsBody from '../../components/Subscriptions/SubscriptionsBody'

export const mapDispatchToProps = (dispatch) => ({
  onCreateSubscription:
    (subscriptionName, subscriptionType) => dispatch(
      actions.createSubscription(subscriptionName, subscriptionType)
    ),
  onUpdateSubscription:
    (conceptId, nativeId, subscriptionName, subscriptionType) => dispatch(
      actions.updateSubscription(conceptId, nativeId, subscriptionName, subscriptionType)
    ),
  onFetchCollectionSubscriptions:
    () => dispatch(actions.getSubscriptions('collection')),
  onDeleteSubscription:
    (conceptId, nativeId, collectionConceptId) => dispatch(
      actions.deleteSubscription(conceptId, nativeId, collectionConceptId)
    )
})

export const mapStateToProps = (state) => ({
  collectionQueryString: getCollectionSubscriptionQueryString(state),
  collectionSubscriptions: getCollectionSubscriptions(state),
  granuleQueryString: getGranuleSubscriptionQueryString(state),
  granuleSubscriptions: getFocusedCollectionSubscriptions(state)
})

// TODO: Needs tests for onCreateSubscription - EDSC-2923
/**
 * Renders SubscriptionsBodyContainer.
 * @param {String} collectionQueryString - String representing the current collection query string.
 * @param {Array} collectionSubscriptions - An array of collection subscriptions.
 * @param {String} granuleQueryString - String representing the current granule query string.
 * @param {Array} granuleSubscriptions - An array of granule subscriptions.
 * @param {Function} onCreateSubscription - Callback to create a subscription.
 * @param {Function} onUpdateSubscription - Callback to update a subscription.
 * @param {Function} onDeleteSubscription - Callback to delete a subscription.
 * @param {Function} onFetchCollectionSubscriptions - Callback to fetch collection subscriptions.
 * @param {String} subscriptionType - The type of subscriptions to display, collection or granule.
 */
export const SubscriptionsBodyContainer = ({
  collectionQueryString,
  collectionSubscriptions,
  granuleQueryString,
  granuleSubscriptions,
  onCreateSubscription,
  onDeleteSubscription,
  onFetchCollectionSubscriptions,
  onUpdateSubscription,
  subscriptionType
}) => {
  let loadedSubscriptions
  let queryString

  if (subscriptionType === 'collection') {
    loadedSubscriptions = collectionSubscriptions
    queryString = collectionQueryString
  } else {
    loadedSubscriptions = granuleSubscriptions
    queryString = granuleQueryString
  }

  useEffect(() => {
    if (subscriptionType === 'collection') {
      onFetchCollectionSubscriptions()
    }
  }, [])

  return (
    <SubscriptionsBody
      queryString={queryString}
      subscriptions={loadedSubscriptions}
      subscriptionType={subscriptionType}
      onCreateSubscription={onCreateSubscription}
      onDeleteSubscription={onDeleteSubscription}
      onUpdateSubscription={onUpdateSubscription}
    />
  )
}

SubscriptionsBodyContainer.propTypes = {
  collectionQueryString: PropTypes.string.isRequired,
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  granuleQueryString: PropTypes.string.isRequired,
  granuleSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFetchCollectionSubscriptions: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
)
