import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onToggleSelectingNewGrid: state => dispatch(actions.toggleSelectingNewGrid(state))
})

/**
 * Component representing the spatial selection dropdown
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
const SpatialSelectionDropdownContainer = (props) => {
  const {
    onToggleSelectingNewGrid
  } = props

  return (
    <SpatialSelectionDropdown
      onToggleSelectingNewGrid={onToggleSelectingNewGrid}
    />
  )
}

SpatialSelectionDropdownContainer.propTypes = {
  onToggleSelectingNewGrid: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
