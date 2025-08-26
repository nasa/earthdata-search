import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import {
  getCollectionSubscriptionDisabledFields,
  getCollectionSubscriptions,
  getGranuleSubscriptionDisabledFields
} from '../../selectors/subscriptions'
import SubscriptionsBody from '../../components/Subscriptions/SubscriptionsBody'

import useEdscStore from '../../zustand/useEdscStore'
import {
  getCollectionSubscriptionQueryObj,
  getGranuleSubscriptionQueryObj
} from '../../zustand/selectors/query'
import { getFocusedCollectionSubscriptions } from '../../zustand/selectors/collection'

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
  collectionSubscriptions: getCollectionSubscriptions(state),
  collectionSubscriptionDisabledFields: getCollectionSubscriptionDisabledFields(state),
  granuleSubscriptionDisabledFields: getGranuleSubscriptionDisabledFields(state)
})

// TODO: Needs tests for onCreateSubscription - EDSC-2923
/**
 * Renders SubscriptionsBodyContainer.
 * @param {Array} collectionSubscriptions - An array of collection subscriptions.
 * @param {Function} onCreateSubscription - Callback to create a subscription.
 * @param {Function} onUpdateSubscription - Callback to update a subscription.
 * @param {Function} onDeleteSubscription - Callback to delete a subscription.
 * @param {Function} onFetchCollectionSubscriptions - Callback to fetch collection subscriptions.
 * @param {String} subscriptionType - The type of subscriptions to display, collection or granule.
 */
export const SubscriptionsBodyContainer = ({
  collectionSubscriptions,
  collectionSubscriptionDisabledFields,
  granuleSubscriptionDisabledFields,
  onCreateSubscription,
  onDeleteSubscription,
  onFetchCollectionSubscriptions,
  onToggleEditSubscriptionModal,
  onUpdateSubscription,
  onUpdateSubscriptionDisabledFields,
  subscriptionType
}) => {
  const granuleSubscriptions = useEdscStore(getFocusedCollectionSubscriptions)
  const collectionQueryObj = useEdscStore(getCollectionSubscriptionQueryObj)
  const granuleQueryObj = useEdscStore(getGranuleSubscriptionQueryObj)

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
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  collectionSubscriptionDisabledFields: PropTypes.shape({}).isRequired,
  granuleSubscriptionDisabledFields: PropTypes.shape({}).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFetchCollectionSubscriptions: PropTypes.func.isRequired,
  onToggleEditSubscriptionModal: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  onUpdateSubscriptionDisabledFields: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
