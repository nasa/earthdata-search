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
  collectionsQuery: state.query.collection,
  panels: state.panels,
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collectionsQuery,
    onMetricsDataAccess,
    // OnSetActivePanel,
    // onSetActivePanelSection,
    // onTogglePanels,
    onUpdateFocusedCollection,
    onUpdateProjectName,
    onViewCollectionDetails,
    onViewCollectionGranules,
    // Panels,
    savedProject
  } = props

  return (
    <ProjectCollections
      collectionsQuery={collectionsQuery}
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
  collectionsQuery: PropTypes.shape({}).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
