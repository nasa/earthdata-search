import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onToggleSelectingNewGrid: state => dispatch(actions.toggleSelectingNewGrid(state)),
  onToggleShapefileUploadModal: state => dispatch(actions.toggleShapefileUploadModal(state))
})

/**
 * Component representing the spatial selection dropdown
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
const SpatialSelectionDropdownContainer = (props) => {
  const {
    onToggleSelectingNewGrid,
    onToggleShapefileUploadModal
  } = props

  return (
    <SpatialSelectionDropdown
      onToggleSelectingNewGrid={onToggleSelectingNewGrid}
      onToggleShapefileUploadModal={onToggleShapefileUploadModal}
    />
  )
}

SpatialSelectionDropdownContainer.propTypes = {
  onToggleSelectingNewGrid: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
