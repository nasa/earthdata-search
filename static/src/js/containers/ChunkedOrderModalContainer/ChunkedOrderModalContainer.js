import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import ChunkedOrderModal from '../../components/ChunkedOrderModal/ChunkedOrderModal'

const mapStateToProps = state => ({
  collectionMetdata: state.metadata.collections,
  location: state.router.location,
  project: state.project,
  isOpen: state.ui.chunkedOrderModal.isOpen
})

const mapDispatchToProps = dispatch => ({
  onToggleChunkedOrderModal:
    state => dispatch(actions.toggleChunkedOrderModal(state)),
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval())
})

export const ChunkedOrderModalContainer = ({
  collectionMetdata,
  location,
  project,
  isOpen,
  onSubmitRetrieval,
  onToggleChunkedOrderModal
}) => (
  <ChunkedOrderModal
    collectionMetdata={collectionMetdata}
    location={location}
    project={project}
    isOpen={isOpen}
    onSubmitRetrieval={onSubmitRetrieval}
    onToggleChunkedOrderModal={onToggleChunkedOrderModal}
  />
)

ChunkedOrderModalContainer.propTypes = {
  collectionMetdata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChunkedOrderModalContainer)
)
