import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { metricsDataAccess } from '../../middleware/metrics/actions'
import { setActivePanel } from '../../actions/projectPanels'
import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

const mapDispatchToProps = dispatch => ({
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleCollectionVisibility:
    collectionId => dispatch(actions.toggleCollectionVisibility(collectionId)),
  onSetActivePanel:
    panelId => dispatch(setActivePanel(panelId)),
  onUpdateProjectName:
    name => dispatch(actions.updateProjectName(name)),
  onMetricsDataAccess:
    data => dispatch(metricsDataAccess(data))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  collectionSearch: state.query.collection,
  mapProjection: state.map.projection,
  project: state.project,
  projectPanels: state.projectPanels,
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    collectionSearch,
    mapProjection,
    project,
    projectPanels,
    savedProject,
    onMetricsDataAccess,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel,
    onUpdateProjectName
  } = props

  return (
    <ProjectCollections
      collections={collections}
      collectionSearch={collectionSearch}
      mapProjection={mapProjection}
      project={project}
      projectPanels={projectPanels}
      savedProject={savedProject}
      onMetricsDataAccess={onMetricsDataAccess}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onToggleCollectionVisibility={onToggleCollectionVisibility}
      onSetActivePanel={onSetActivePanel}
      onUpdateProjectName={onUpdateProjectName}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
