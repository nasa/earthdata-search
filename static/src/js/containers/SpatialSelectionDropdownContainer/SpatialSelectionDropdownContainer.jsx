import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'
import { metricsSpatialSelection } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onToggleShapefileUploadModal: (state) => dispatch(actions.toggleShapefileUploadModal(state)),
  onMetricsSpatialSelection: (data) => dispatch(metricsSpatialSelection(data))
})

/**
 * Component representing the spatial selection dropdown
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
export const SpatialSelectionDropdownContainer = (props) => {
  const {
    onMetricsSpatialSelection,
    onToggleShapefileUploadModal
  } = props

  return (
    <SpatialSelectionDropdown
      onToggleShapefileUploadModal={onToggleShapefileUploadModal}
      onMetricsSpatialSelection={onMetricsSpatialSelection}
    />
  )
}

SpatialSelectionDropdownContainer.propTypes = {
  onMetricsSpatialSelection: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
