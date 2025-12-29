import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import { metricsSpatialSelection } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsSpatialSelection: (data) => dispatch(metricsSpatialSelection(data))
})

/**
 * Component representing the spatial selection dropdown
 */
export const SpatialSelectionDropdownContainer = ({
  onMetricsSpatialSelection
}) => (
  <SpatialSelectionDropdown
    onMetricsSpatialSelection={onMetricsSpatialSelection}
  />
)

SpatialSelectionDropdownContainer.propTypes = {
  onMetricsSpatialSelection: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
