import React from 'react'
import { PropTypes } from 'prop-types'

import ProjectCollectionItem from './ProjectCollectionItem'
import ProjectHeader from './ProjectHeader'


/**
 * Renders ProjectCollectionsList.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - List of collections passed from redux store.
 * @param {function} props.onRemoveCollectionFromProject - Fired when the remove button is clicked
 */
const ProjectCollectionsList = (props) => {
  const {
    collections,
    onRemoveCollectionFromProject
  } = props

  const {
    byId,
    projectIds
  } = collections

  const collectionsList = projectIds.map(collectionId => (
    <ProjectCollectionItem
      collectionId={collectionId}
      collection={byId[collectionId]}
      key={collectionId}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
    />
  ))

  return (
    <>
      <ProjectHeader
        collections={collections}
      />
      <ul className="granule-results-list__list">
        {collectionsList}
      </ul>
    </>
  )
}

ProjectCollectionsList.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default ProjectCollectionsList
