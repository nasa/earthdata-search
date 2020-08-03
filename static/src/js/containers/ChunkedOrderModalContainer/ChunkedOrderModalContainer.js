import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import {
  getProjectCollectionsMetadata,
  getProjectCollectionsRequiringChunking
} from '../../selectors/project'

import ChunkedOrderModal from '../../components/ChunkedOrderModal/ChunkedOrderModal'

const mapStateToProps = state => ({
  isOpen: state.ui.chunkedOrderModal.isOpen,
  location: state.router.location,
  project: state.project,
  projectCollectionsMetadata: getProjectCollectionsMetadata(state),
  projectCollectionsRequiringChunking: getProjectCollectionsRequiringChunking(state)
})

const mapDispatchToProps = dispatch => ({
  onToggleChunkedOrderModal:
    state => dispatch(actions.toggleChunkedOrderModal(state)),
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval())
})

export const ChunkedOrderModalContainer = ({
  isOpen,
  location,
  onSubmitRetrieval,
  onToggleChunkedOrderModal,
  projectCollectionsMetadata,
  projectCollectionsRequiringChunking
}) => (
  <ChunkedOrderModal
    isOpen={isOpen}
    location={location}
    onSubmitRetrieval={onSubmitRetrieval}
    onToggleChunkedOrderModal={onToggleChunkedOrderModal}
    projectCollectionsMetadata={projectCollectionsMetadata}
    projectCollectionsRequiringChunking={projectCollectionsRequiringChunking}
  />
)

ChunkedOrderModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  projectCollectionsRequiringChunking: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChunkedOrderModalContainer)
)
