import React from 'react'
import { PropTypes } from 'prop-types'

import ProjectHeader from './ProjectHeader'
import ProjectCollectionsList from './ProjectCollectionsList'

import './ProjectCollections.scss'

/**
 * Renders ProjectCollections.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - List of collections passed from redux store.
 * @param {function} props.onRemoveCollectionFromProject - Fired when the remove button is clicked
 */
const ProjectCollections = (props) => {
  const {
    collections,
    collectionsSearch,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility
  } = props

  const collectionsLoading = collectionsSearch.isLoading

  return (
    <section className="project-collections">
      <ProjectHeader
        collections={collections}
        loading={collectionsLoading}
      />
      <ProjectCollectionsList
        collections={collections}
        loading={collectionsLoading}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
      />
      <div className="project-collections__footer">
        Footer
      </div>
    </section>
  )
}

ProjectCollections.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired
}

export default ProjectCollections
