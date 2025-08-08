import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

export const mapDispatchToProps = (dispatch) => ({
  onUpdateProjectName:
    (name) => dispatch(actions.updateProjectName(name)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data)),
  onUpdateFocusedCollection:
    (collectionId) => dispatch(actions.updateFocusedCollection(collectionId)),
  onViewCollectionDetails:
    (data) => dispatch(actions.viewCollectionDetails(data)),
  onViewCollectionGranules:
    (data) => dispatch(actions.viewCollectionGranules(data))
})

export const mapStateToProps = (state) => ({
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    onMetricsDataAccess,
    onUpdateFocusedCollection,
    onUpdateProjectName,
    onViewCollectionDetails,
    onViewCollectionGranules,
    savedProject
  } = props

  return (
    <ProjectCollections
      onMetricsDataAccess={onMetricsDataAccess}
      onUpdateFocusedCollection={onUpdateFocusedCollection}
      onUpdateProjectName={onUpdateProjectName}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      savedProject={savedProject}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  onMetricsDataAccess: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
