import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import ChunkedOrderModal from '../../components/ChunkedOrderModal/ChunkedOrderModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.chunkedOrderModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleChunkedOrderModal:
    (state) => dispatch(actions.toggleChunkedOrderModal(state)),
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval())
})

export const ChunkedOrderModalContainer = ({
  isOpen,
  onSubmitRetrieval,
  onToggleChunkedOrderModal
}) => (
  <ChunkedOrderModal
    isOpen={isOpen}
    onSubmitRetrieval={onSubmitRetrieval}
    onToggleChunkedOrderModal={onToggleChunkedOrderModal}
  />
)

ChunkedOrderModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ChunkedOrderModalContainer)
