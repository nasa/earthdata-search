import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import ProjectCollectionsList from '../../components/ProjectCollections/ProjectCollectionsList'

const mapDispatchToProps = dispatch => ({
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleCollectionVisibility:
    collectionId => dispatch(actions.toggleCollectionVisibility(collectionId))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility
  } = props

  return (
    <div style={{ backgroundColor: 'white' }}>
      <ProjectCollectionsList
        collections={collections}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
      />
    </div>
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
