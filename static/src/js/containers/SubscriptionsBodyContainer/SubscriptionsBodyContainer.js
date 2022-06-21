import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import { getCollectionSubscriptionQueryObj, getGranuleSubscriptionQueryObj } from '../../selectors/query'
import { getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'
import {
  getCollectionSubscriptionDisabledFields,
  getCollectionSubscriptions,
  getGranuleSubscriptionDisabledFields
} from '../../selectors/subscriptions'
import SubscriptionsBody from '../../components/Subscriptions/SubscriptionsBody'

export const mapDispatchToProps = (dispatch) => ({
  onCreateSubscription:
    (subscriptionName, subscriptionType) => dispatch(
      actions.createSubscription(subscriptionName, subscriptionType)
    ),
  onUpdateSubscription:
    (data) => dispatch(
      actions.updateSubscription(data)
    ),
  onUpdateSubscriptionDisabledFields:
    (data) => dispatch(actions.updateSubscriptionDisabledFields(data)),
  onFetchCollectionSubscriptions:
    () => dispatch(actions.getSubscriptions('collection')),
  onDeleteSubscription:
    (conceptId, nativeId, collectionConceptId) => dispatch(
      actions.deleteSubscription(conceptId, nativeId, collectionConceptId)
    ),
  onToggleEditSubscriptionModal:
    (state) => dispatch(actions.toggleEditSubscriptionModal(state))
})

export const mapStateToProps = (state) => ({
  collectionQueryObj: getCollectionSubscriptionQueryObj(state),
  collectionSubscriptions: getCollectionSubscriptions(state),
  collectionSubscriptionDisabledFields: getCollectionSubscriptionDisabledFields(state),
  granuleQueryObj: getGranuleSubscriptionQueryObj(state),
  granuleSubscriptions: getFocusedCollectionSubscriptions(state),
  granuleSubscriptionDisabledFields: getGranuleSubscriptionDisabledFields(state)
})

// TODO: Needs tests for onCreateSubscription - EDSC-2923
/**
 * Renders SubscriptionsBodyContainer.
 * @param {String} collectionQueryObj - String representing the current collection query string.
 * @param {Array} collectionSubscriptions - An array of collection subscriptions.
 * @param {String} granuleQueryObj - String representing the current granule query string.
 * @param {Array} granuleSubscriptions - An array of granule subscriptions.
 * @param {Function} onCreateSubscription - Callback to create a subscription.
 * @param {Function} onUpdateSubscription - Callback to update a subscription.
 * @param {Function} onDeleteSubscription - Callback to delete a subscription.
 * @param {Function} onFetchCollectionSubscriptions - Callback to fetch collection subscriptions.
 * @param {String} subscriptionType - The type of subscriptions to display, collection or granule.
 */
export const SubscriptionsBodyContainer = ({
  collectionQueryObj,
  collectionSubscriptions,
  collectionSubscriptionDisabledFields,
  granuleQueryObj,
  granuleSubscriptions,
  granuleSubscriptionDisabledFields,
  onCreateSubscription,
  onDeleteSubscription,
  onFetchCollectionSubscriptions,
  onToggleEditSubscriptionModal,
  onUpdateSubscription,
  onUpdateSubscriptionDisabledFields,
  subscriptionType
}) => {
  let loadedSubscriptions
  let query
  let disabledFields

  if (subscriptionType === 'collection') {
    loadedSubscriptions = collectionSubscriptions
    query = collectionQueryObj
    disabledFields = collectionSubscriptionDisabledFields
  } else {
    loadedSubscriptions = granuleSubscriptions
    query = granuleQueryObj
    disabledFields = granuleSubscriptionDisabledFields
  }

  useEffect(() => {
    if (subscriptionType === 'collection') {
      onFetchCollectionSubscriptions()
    }
  }, [])

  return (
    <SubscriptionsBody
      disabledFields={disabledFields}
      query={query}
      subscriptions={loadedSubscriptions}
      subscriptionType={subscriptionType}
      onCreateSubscription={onCreateSubscription}
      onDeleteSubscription={onDeleteSubscription}
      onUpdateSubscription={onUpdateSubscription}
      onUpdateSubscriptionDisabledFields={onUpdateSubscriptionDisabledFields}
      onToggleEditSubscriptionModal={onToggleEditSubscriptionModal}
    />
  )
}

SubscriptionsBodyContainer.propTypes = {
  collectionQueryObj: PropTypes.shape({}).isRequired,
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  collectionSubscriptionDisabledFields: PropTypes.shape({}).isRequired,
  granuleQueryObj: PropTypes.shape({}).isRequired,
  granuleSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  granuleSubscriptionDisabledFields: PropTypes.shape({}).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFetchCollectionSubscriptions: PropTypes.func.isRequired,
  onToggleEditSubscriptionModal: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  onUpdateSubscriptionDisabledFields: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
)
