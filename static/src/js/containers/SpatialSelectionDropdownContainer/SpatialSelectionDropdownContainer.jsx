import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath: (portalId) => dispatch(actions.changePath(portalId)),
  onChangeUrl: (data) => dispatch(actions.changeUrl(data))
})

/**
 * Component representing the spatial selection dropdown
 */
export const SpatialSelectionDropdownContainer = ({
  searchParams = {},
  onChangeUrl,
  onChangePath
}) => (
  <SpatialSelectionDropdown
    searchParams={searchParams}
    onChangeUrl={onChangeUrl}
    onChangePath={onChangePath}
  />
)

SpatialSelectionDropdownContainer.propTypes = {
  searchParams: PropTypes.shape(),
  onChangeUrl: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
