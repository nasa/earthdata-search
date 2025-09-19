import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'
import { metricsSpatialSelection } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath: (portalId) => dispatch(actions.changePath(portalId)),
  onChangeUrl: (data) => dispatch(actions.changeUrl(data)),
  onToggleShapefileUploadModal: (state) => dispatch(actions.toggleShapefileUploadModal(state)),
  onMetricsSpatialSelection: (data) => dispatch(metricsSpatialSelection(data))
})

/**
 * Component representing the spatial selection dropdown
 */
export const SpatialSelectionDropdownContainer = ({
  searchParams = {},
  onChangeUrl,
  onChangePath,
  onMetricsSpatialSelection,
  onToggleShapefileUploadModal
}) => (
  <SpatialSelectionDropdown
    searchParams={searchParams}
    onChangeUrl={onChangeUrl}
    onChangePath={onChangePath}
    onToggleShapefileUploadModal={onToggleShapefileUploadModal}
    onMetricsSpatialSelection={onMetricsSpatialSelection}
  />
)

SpatialSelectionDropdownContainer.propTypes = {
  searchParams: PropTypes.shape(),
  onChangeUrl: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onMetricsSpatialSelection: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
