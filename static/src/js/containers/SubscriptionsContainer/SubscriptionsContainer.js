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
      subscriptions
    } = this.props

    return (
      <SubscriptionsList
        subscriptions={subscriptions}
      />
    )
  }
}

SubscriptionsContainer.propTypes = {
  subscriptions: PropTypes.shape({}).isRequired,
  onFetchSubscriptions: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsContainer)
)
