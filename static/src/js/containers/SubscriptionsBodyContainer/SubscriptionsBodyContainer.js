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

const mapDispatchToProps = dispatch => ({
  onCreateSubscription:
    () => dispatch(actions.createSubscription())
})

const mapStateToProps = state => ({
  granuleQueryString: getFocusedGranuleQueryString(state),
  subscriptions: getFocusedCollectionSubscriptions(state)
})

// TODO: Needs tests for onCreateSubscription - EDSC-2923
/**
 * Renders SubscriptionsBodyContainer.
 * @param {Node} granuleQueryString - String representing the current granule query string.
 * @param {String} onCreateSubscription - Callback to create a subscription.
 * @param {Array} subscriptions - An array of subscriptions.
 */
export const SubscriptionsBodyContainer = ({
  granuleQueryString,
  subscriptions,
  onCreateSubscription
}) => (
  <SubscriptionsBody
    granuleQueryString={granuleQueryString}
    subscriptions={subscriptions}
    onCreateSubscription={onCreateSubscription}
  />
)

SubscriptionsBodyContainer.propTypes = {
  granuleQueryString: PropTypes.string.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onCreateSubscription: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
)
