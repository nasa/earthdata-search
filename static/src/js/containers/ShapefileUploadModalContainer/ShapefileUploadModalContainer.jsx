import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import ShapefileUploadModal from '../../components/ShapefileUploadModal/ShapefileUploadModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.shapefileUploadModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleShapefileUploadModal:
    (state) => dispatch(actions.toggleShapefileUploadModal(state))
})

export const ShapefileUploadModalContainer = ({
  isOpen,
  onToggleShapefileUploadModal
}) => (
  <ShapefileUploadModal
    isOpen={isOpen}
    onToggleShapefileUploadModal={onToggleShapefileUploadModal}
  />
)

ShapefileUploadModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapefileUploadModalContainer)
