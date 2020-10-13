import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialSelectionDropdown from '../../components/SpatialDisplay/SpatialSelectionDropdown'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onToggleShapefileUploadModal: state => dispatch(actions.toggleShapefileUploadModal(state))
})

/**
 * Component representing the spatial selection dropdown
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
const SpatialSelectionDropdownContainer = (props) => {
  const {
    onToggleShapefileUploadModal
  } = props

  return (
    <SpatialSelectionDropdown
      onToggleShapefileUploadModal={onToggleShapefileUploadModal}
    />
  )
}

SpatialSelectionDropdownContainer.propTypes = {
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SpatialSelectionDropdownContainer)
