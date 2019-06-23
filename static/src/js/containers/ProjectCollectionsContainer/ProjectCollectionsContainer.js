import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { setActivePanel } from '../../actions/projectPanels'
import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

const mapDispatchToProps = dispatch => ({
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleCollectionVisibility:
    collectionId => dispatch(actions.toggleCollectionVisibility(collectionId)),
  onSetActivePanel:
    panelId => dispatch(setActivePanel(panelId))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  collectionsSearch: state.searchResults.collections,
  project: state.project,
  projectPanels: state.projectPanels
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    collectionsSearch,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel,
    project,
    projectPanels
  } = props

  return (
    <ProjectCollections
      collections={collections}
      collectionsSearch={collectionsSearch}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onToggleCollectionVisibility={onToggleCollectionVisibility}
      onSetActivePanel={onSetActivePanel}
      project={project}
      projectPanels={projectPanels}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
