import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import { getProjectCollectionsMetadata, getProjectCollectionsIds } from '../../selectors/project'
import { getHandoffs } from '../../selectors/handoffs'

import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

export const mapDispatchToProps = (dispatch) => ({
  onRemoveCollectionFromProject:
    (collectionId) => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleCollectionVisibility:
    (collectionId) => dispatch(actions.toggleCollectionVisibility(collectionId)),
  onSetActivePanel:
    (panelId) => dispatch(actions.setActivePanel(panelId)),
  onTogglePanels:
    (isOpen) => dispatch(actions.togglePanels(isOpen)),
  onSetActivePanelSection:
    (sectionId) => dispatch(actions.setActivePanelSection(sectionId)),
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
  handoffs: getHandoffs(state),
  mapProjection: state.map.projection,
  panels: state.panels,
  project: state.project,
  projectCollectionsIds: getProjectCollectionsIds(state),
  projectCollectionsMetadata: getProjectCollectionsMetadata(state),
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collectionsQuery,
    handoffs,
    mapProjection,
    onMetricsDataAccess,
    onRemoveCollectionFromProject,
    onSetActivePanel,
    onSetActivePanelSection,
    onToggleCollectionVisibility,
    onTogglePanels,
    onUpdateFocusedCollection,
    onUpdateProjectName,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panels,
    project,
    projectCollectionsIds,
    projectCollectionsMetadata,
    savedProject
  } = props

  return (
    <ProjectCollections
      collectionsQuery={collectionsQuery}
      handoffs={handoffs}
      mapProjection={mapProjection}
      onMetricsDataAccess={onMetricsDataAccess}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onSetActivePanel={onSetActivePanel}
      onSetActivePanelSection={onSetActivePanelSection}
      onToggleCollectionVisibility={onToggleCollectionVisibility}
      onTogglePanels={onTogglePanels}
      onUpdateFocusedCollection={onUpdateFocusedCollection}
      onUpdateProjectName={onUpdateProjectName}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      panels={panels}
      project={project}
      projectCollectionsIds={projectCollectionsIds}
      projectCollectionsMetadata={projectCollectionsMetadata}
      savedProject={savedProject}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collectionsQuery: PropTypes.shape({}).isRequired,
  handoffs: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
