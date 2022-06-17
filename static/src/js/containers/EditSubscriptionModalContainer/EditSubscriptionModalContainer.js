import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import { getSubscriptions } from '../../selectors/subscriptions'
import { getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'

import EditSubscriptionModal from '../../components/EditSubscriptionModal/EditSubscriptionModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.editSubscriptionModal.isOpen,
  subscriptionConceptId: state.ui.editSubscriptionModal.subscriptionConceptId,
  subscriptionType: state.ui.editSubscriptionModal.type,
  subscriptions: getSubscriptions(state),
  granuleSubscriptions: getFocusedCollectionSubscriptions(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleEditSubscriptionModal:
    (state) => dispatch(actions.toggleEditSubscriptionModal(state)),
  onUpdateSubscription:
    (conceptId, nativeId, subscriptionName, subscriptionType) => dispatch(
      actions.updateSubscription(conceptId, nativeId, subscriptionName, subscriptionType)
    )
})

export const EditSubscriptionModalContainer = ({
  isOpen,
  onToggleEditSubscriptionModal,
  onUpdateSubscription,
  granuleSubscriptions,
  subscriptions,
  subscriptionConceptId,
  subscriptionType
}) => (
  <EditSubscriptionModal
    isOpen={isOpen}
    onToggleEditSubscriptionModal={onToggleEditSubscriptionModal}
    onUpdateSubscription={onUpdateSubscription}
    granuleSubscriptions={granuleSubscriptions}
    subscriptions={subscriptions}
    subscriptionConceptId={subscriptionConceptId}
    subscriptionType={subscriptionType}
  />
)

EditSubscriptionModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleEditSubscriptionModal: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  granuleSubscriptions: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  subscriptions: PropTypes.shape({}).isRequired,
  subscriptionConceptId: PropTypes.string.isRequired,
  subscriptionType: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionModalContainer)
