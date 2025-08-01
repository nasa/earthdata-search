import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

// @ts-expect-error The file does not have types
import actions from '../../actions'

import OverrideTemporalModal from '../../components/OverrideTemporalModal/OverrideTemporalModal'

// @ts-expect-error Don't want to define types for all of Redux
export const mapStateToProps = (state) => ({
  isOpen: state.ui.overrideTemporalModal.isOpen
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onToggleOverrideTemporalModal:
    (open: boolean) => dispatch(actions.toggleOverrideTemporalModal(open))
})

interface OverrideTemporalModalContainerProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Function to toggle the override temporal modal */
  onToggleOverrideTemporalModal: (open: boolean) => void
}

export const OverrideTemporalModalContainer: React.FC<OverrideTemporalModalContainerProps> = ({
  isOpen,
  onToggleOverrideTemporalModal
}) => (
  <OverrideTemporalModal
    isOpen={isOpen}
    onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
  />
)

export default connect(mapStateToProps, mapDispatchToProps)(OverrideTemporalModalContainer)
