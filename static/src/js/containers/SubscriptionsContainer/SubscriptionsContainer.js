import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import SubscriptionsList from '../../components/SubscriptionsList/SubscriptionsList'

import { getSubscriptions } from '../../selectors/subscriptions'

const mapStateToProps = state => ({
  subscriptions: getSubscriptions(state)
})

const mapDispatchToProps = dispatch => ({
  onDeleteSubscription: data => dispatch(actions.deleteSubscription(data)),
  onFetchSubscriptions: () => dispatch(actions.getSubscriptions())
})

export class SubscriptionsContainer extends Component {
  componentDidMount() {
    const {
      onFetchSubscriptions
    } = this.props

    onFetchSubscriptions()
  }

  render() {
    const {
      subscriptions,
      onDeleteSubscription
    } = this.props

    return (
      <SubscriptionsList
        subscriptions={subscriptions}
        onDeleteSubscription={onDeleteSubscription}
      />
    )
  }
}

SubscriptionsContainer.propTypes = {
  subscriptions: PropTypes.shape({}).isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFetchSubscriptions: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsContainer)
)
