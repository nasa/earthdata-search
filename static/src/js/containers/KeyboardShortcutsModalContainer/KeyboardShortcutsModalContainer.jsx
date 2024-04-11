import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import KeyboardShortcutsModal from '../../components/KeyboardShortcutsModal/KeyboardShortcutsModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.keyboardShortcutsModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleKeyboardShortcutsModal: (state) => dispatch(actions.toggleKeyboardShortcutsModal(state))
})

export const KeyboardShortcutsModalContainer = ({
  isOpen,
  onToggleKeyboardShortcutsModal
}) => (
  <KeyboardShortcutsModal
    isOpen={isOpen}
    onToggleKeyboardShortcutsModal={onToggleKeyboardShortcutsModal}
  />
)

KeyboardShortcutsModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleKeyboardShortcutsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcutsModalContainer)
