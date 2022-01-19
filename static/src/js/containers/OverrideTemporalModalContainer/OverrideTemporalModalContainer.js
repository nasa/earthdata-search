import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import OverrideTemporalModal from '../../components/OverrideTemporalModal/OverrideTemporalModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.overrideTemporalModal.isOpen,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export const mapDispatchToProps = (dispatch) => ({
  onChangeProjectQuery:
    (query) => dispatch(actions.changeProjectQuery(query)),
  onToggleOverrideTemporalModal:
    (open) => dispatch(actions.toggleOverrideTemporalModal(open))
})

export const OverrideTemporalModalContainer = ({
  isOpen,
  temporalSearch,
  timeline,
  onChangeProjectQuery,
  onToggleOverrideTemporalModal
}) => (
  <OverrideTemporalModal
    isOpen={isOpen}
    temporalSearch={temporalSearch}
    timeline={timeline}
    onChangeQuery={onChangeProjectQuery}
    onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
  />
)

OverrideTemporalModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  temporalSearch: PropTypes.shape({}).isRequired,
  timeline: PropTypes.shape({}).isRequired,
  onChangeProjectQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(OverrideTemporalModalContainer)
