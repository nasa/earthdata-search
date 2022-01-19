import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import TooManyPointsModal from '../../components/TooManyPointsModal/TooManyPointsModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.tooManyPointsModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleTooManyPointsModal:
    (state) => dispatch(actions.toggleTooManyPointsModal(state))
})

export const TooManyPointsModalContainer = ({
  isOpen,
  onToggleTooManyPointsModal
}) => (
  <TooManyPointsModal
    isOpen={isOpen}
    onToggleTooManyPointsModal={onToggleTooManyPointsModal}
  />
)

TooManyPointsModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TooManyPointsModalContainer)
