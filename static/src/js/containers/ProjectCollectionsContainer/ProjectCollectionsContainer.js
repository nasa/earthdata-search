import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { setActivePanel } from '../../reducers/projectPanels'
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
  collectionsSearch: state.searchResults.collections
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    collectionsSearch,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel
  } = props

  return (
    <ProjectCollections
      collections={collections}
      collectionsSearch={collectionsSearch}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onToggleCollectionVisibility={onToggleCollectionVisibility}
      onSetActivePanel={onSetActivePanel}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
