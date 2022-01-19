import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import { getFocusedGranuleQueryString } from '../../selectors/query'
import { getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'

import SubscriptionsBody from '../../components/Subscriptions/SubscriptionsBody'

export const mapDispatchToProps = (dispatch) => ({
  onCreateSubscription:
    () => dispatch(actions.createSubscription()),
  onUpdateSubscription:
    (conceptId, nativeId, subscriptionName) => dispatch(
      actions.updateSubscription(conceptId, nativeId, subscriptionName)
    ),
  onDeleteSubscription:
    (conceptId, nativeId, collectionConceptId) => dispatch(
      actions.deleteSubscription(conceptId, nativeId, collectionConceptId)
    )
})

export const mapStateToProps = (state) => ({
  granuleQueryString: getFocusedGranuleQueryString(state),
  subscriptions: getFocusedCollectionSubscriptions(state)
})

// TODO: Needs tests for onCreateSubscription - EDSC-2923
/**
 * Renders SubscriptionsBodyContainer.
 * @param {Node} granuleQueryString - String representing the current granule query string.
 * @param {String} onCreateSubscription - Callback to create a subscription.
 * @param {String} onUpdateSubscription - Callback to update a subscription.
 * @param {String} onDeleteSubscription - Callback to delete a subscription.
 * @param {Array} subscriptions - An array of subscriptions.
 */
export const SubscriptionsBodyContainer = ({
  granuleQueryString,
  subscriptions,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateSubscription
}) => (
  <SubscriptionsBody
    granuleQueryString={granuleQueryString}
    subscriptions={subscriptions}
    onCreateSubscription={onCreateSubscription}
    onDeleteSubscription={onDeleteSubscription}
    onUpdateSubscription={onUpdateSubscription}
  />
)

SubscriptionsBodyContainer.propTypes = {
  granuleQueryString: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
)
