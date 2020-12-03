import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import { getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'

import SubscriptionsBody from '../../components/Subscriptions/SubscriptionsBody'

const mapDispatchToProps = dispatch => ({
  onCreateSubscription:
    () => dispatch(actions.createSubscription())
})

const mapStateToProps = state => ({
  subscriptions: getFocusedCollectionSubscriptions(state)
})

export const SubscriptionsBodyContainer = ({
  subscriptions,
  onCreateSubscription
}) => (
  <SubscriptionsBody
    subscriptions={subscriptions}
    onCreateSubscription={onCreateSubscription}
  />
)

SubscriptionsBodyContainer.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onCreateSubscription: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsBodyContainer)
)
