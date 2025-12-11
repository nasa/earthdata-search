import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'
import { metricsSpatialSelection } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath: (portalId) => dispatch(actions.changePath(portalId)),
  onChangeUrl: (data) => dispatch(actions.changeUrl(data)),
  onMetricsSpatialSelection: (data) => dispatch(metricsSpatialSelection(data))
})

/**
 * Component representing the spatial selection dropdown
 */
export const SpatialSelectionDropdownContainer = ({
  searchParams = {},
  onChangeUrl,
  onChangePath,
  onMetricsSpatialSelection
}) => (
  <SpatialSelectionDropdown
    searchParams={searchParams}
    onChangeUrl={onChangeUrl}
    onChangePath={onChangePath}
    onMetricsSpatialSelection={onMetricsSpatialSelection}
  />
)

SpatialSelectionDropdownContainer.propTypes = {
  searchParams: PropTypes.shape(),
  onChangeUrl: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onMetricsSpatialSelection: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
