import React from 'react'
import { PropTypes } from 'prop-types'

import ProjectCollectionItem from './ProjectCollectionItem'
import ProjectHeader from './ProjectHeader'
import colors from '../../util/colors'


/**
 * Renders ProjectCollectionsList.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - List of collections passed from redux store.
 * @param {function} props.onRemoveCollectionFromProject - Fired when the remove button is clicked
 */
const ProjectCollectionsList = (props) => {
  const {
    collections,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility
  } = props

  const {
    byId,
    projectIds
  } = collections

  const collectionsList = projectIds.map((collectionId, index) => {
    const color = Object.values(colors)[index]
    return (
      <ProjectCollectionItem
        collectionId={collectionId}
        collection={byId[collectionId]}
        color={color}
        key={collectionId}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
      />
    )
  })

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
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired
}

export default ProjectCollectionsList
