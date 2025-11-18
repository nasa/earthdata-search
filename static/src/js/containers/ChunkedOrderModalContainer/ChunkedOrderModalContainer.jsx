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
    (state) => dispatch(actions.toggleChunkedOrderModal(state))
})

export const ChunkedOrderModalContainer = ({
  isOpen,
  onToggleChunkedOrderModal
}) => (
  <ChunkedOrderModal
    isOpen={isOpen}
    onToggleChunkedOrderModal={onToggleChunkedOrderModal}
  />
)

ChunkedOrderModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ChunkedOrderModalContainer)
