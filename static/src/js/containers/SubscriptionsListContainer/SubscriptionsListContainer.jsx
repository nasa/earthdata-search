import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SubscriptionsList from '../../components/SubscriptionsList/SubscriptionsList'

import { getSubscriptions } from '../../selectors/subscriptions'

export const mapStateToProps = (state) => ({
  subscriptions: getSubscriptions(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onDeleteSubscription:
    (conceptId, nativeId) => dispatch(actions.deleteSubscription(conceptId, nativeId)),
  onFetchSubscriptions: () => dispatch(actions.getSubscriptions()),
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId))
})

export class SubscriptionsListContainer extends Component {
  componentDidMount() {
    const {
      onFetchSubscriptions
    } = this.props

    onFetchSubscriptions()
  }

  render() {
    const {
      subscriptions,
      onDeleteSubscription,
      onFocusedCollectionChange
    } = this.props

    return (
      <SubscriptionsList
        subscriptions={subscriptions}
        onDeleteSubscription={onDeleteSubscription}
        onFocusedCollectionChange={onFocusedCollectionChange}
      />
    )
  }
}

SubscriptionsListContainer.propTypes = {
  subscriptions: PropTypes.shape({}).isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFetchSubscriptions: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsListContainer)
