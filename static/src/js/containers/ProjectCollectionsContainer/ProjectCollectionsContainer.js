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
  collectionsSearchResults: state.searchResults.collections,
  project: state.project,
  projectPanels: state.projectPanels,
  collectionSearch: state.query.collection
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    collectionsSearchResults,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel,
    project,
    projectPanels,
    collectionSearch
  } = props

  return (
    <ProjectCollections
      collections={collections}
      collectionsSearchResults={collectionsSearchResults}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onToggleCollectionVisibility={onToggleCollectionVisibility}
      onSetActivePanel={onSetActivePanel}
      project={project}
      projectPanels={projectPanels}
      collectionSearch={collectionSearch}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionsSearchResults: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
