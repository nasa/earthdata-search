import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { metricsDataAccess } from '../../middleware/metrics/actions'
import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

const mapDispatchToProps = dispatch => ({
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleCollectionVisibility:
    collectionId => dispatch(actions.toggleCollectionVisibility(collectionId)),
  onSetActivePanel:
    panelId => dispatch(actions.setActivePanel(panelId)),
  onUpdateProjectName:
    name => dispatch(actions.updateProjectName(name)),
  onMetricsDataAccess:
    data => dispatch(metricsDataAccess(data))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  collectionSearch: state.query.collection,
  project: state.project,
  panels: state.panels,
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    collectionSearch,
    project,
    panels,
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
      project={project}
      panels={panels}
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
  project: PropTypes.shape({}).isRequired,
  panels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
