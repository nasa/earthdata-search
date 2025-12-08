import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import { getSubscriptions } from '../../selectors/subscriptions'

import EditSubscriptionModal from '../../components/EditSubscriptionModal/EditSubscriptionModal'

export const mapStateToProps = (state) => ({
  subscriptions: getSubscriptions(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onUpdateSubscription:
    (conceptId, nativeId, subscriptionName, subscriptionType) => dispatch(
      actions.updateSubscription(conceptId, nativeId, subscriptionName, subscriptionType)
    )
})

export const EditSubscriptionModalContainer = ({
  onUpdateSubscription,
  subscriptions
}) => (
  <EditSubscriptionModal
    onUpdateSubscription={onUpdateSubscription}
    subscriptions={subscriptions}
  />
)

EditSubscriptionModalContainer.propTypes = {
  onUpdateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionModalContainer)
