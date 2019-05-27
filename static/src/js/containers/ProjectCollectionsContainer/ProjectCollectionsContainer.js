import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import ProjectCollectionsList from '../../components/ProjectCollections/ProjectCollectionsList'

const mapDispatchToProps = dispatch => ({
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections
})

export const ProjectCollectionsContainer = (props) => {
  const {
    collections,
    onRemoveCollectionFromProject
  } = props

  return (
    <div style={{ backgroundColor: 'white' }}>
      <ProjectCollectionsList
        collections={collections}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      />
    </div>
  )
}

ProjectCollectionsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
