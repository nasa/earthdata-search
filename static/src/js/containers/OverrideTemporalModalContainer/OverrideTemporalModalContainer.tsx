import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

// @ts-expect-error The file does not have types
import actions from '../../actions'

import OverrideTemporalModal from '../../components/OverrideTemporalModal/OverrideTemporalModal'

import { Query } from '../../types/sharedTypes'

// @ts-expect-error Don't want to define types for all of Redux
export const mapStateToProps = (state) => ({
  isOpen: state.ui.overrideTemporalModal.isOpen,
  temporalSearch: state.query.collection.temporal
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onChangeProjectQuery:
    (query: Query) => dispatch(actions.changeProjectQuery(query)),
  onToggleOverrideTemporalModal:
    (open: boolean) => dispatch(actions.toggleOverrideTemporalModal(open))
})

interface OverrideTemporalModalContainerProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** The temporal search object */
  temporalSearch: {
    /** The end date of the temporal search */
    endDate?: string
    /** The start date of the temporal search */
    startDate?: string
  }
  /** Function to change the project query */
  onChangeProjectQuery: (query: Query) => void
  /** Function to toggle the override temporal modal */
  onToggleOverrideTemporalModal: (open: boolean) => void
}

export const OverrideTemporalModalContainer: React.FC<OverrideTemporalModalContainerProps> = ({
  isOpen,
  temporalSearch,
  onChangeProjectQuery,
  onToggleOverrideTemporalModal
}) => (
  <OverrideTemporalModal
    isOpen={isOpen}
    temporalSearch={temporalSearch}
    onChangeQuery={onChangeProjectQuery}
    onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
  />
)

export default connect(mapStateToProps, mapDispatchToProps)(OverrideTemporalModalContainer)
