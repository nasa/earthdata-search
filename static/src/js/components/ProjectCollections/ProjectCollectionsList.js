import React from 'react'
import { PropTypes } from 'prop-types'
import { withRouter } from 'react-router-dom'

import SimpleBar from 'simplebar-react'

import { getColorByIndex } from '../../util/colors'

import ProjectCollectionItem from './ProjectCollectionsItem'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './ProjectCollectionsList.scss'

/**
 * Renders ProjectCollectionsList.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - List of collections passed from redux store.
 * @param {function} props.onRemoveCollectionFromProject - Fired when the remove button is clicked
 */
export const ProjectCollectionsList = (props) => {
  const {
    collections,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    location,
    onSetActivePanel,
    project,
    panels,
    collectionSearch
  } = props

  const { byId } = collections
  const { collectionIds: projectIds, byId: projectById } = project

  const projectIsEmpty = !projectIds.length

  const activePanel = panels.isOpen ? panels.activePanel.split('.')[1] : null

  const collectionsList = projectIds.map((collectionId, index) => {
    const isPanelActive = activePanel === index.toString()
    const color = getColorByIndex(index)
    return (
      <ProjectCollectionItem
        collectionId={collectionId}
        collection={byId[collectionId]}
        projectCollection={projectById[collectionId]}
        color={color}
        index={index}
        isPanelActive={isPanelActive}
        key={collectionId}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
        onSetActivePanel={onSetActivePanel}
        collectionSearch={collectionSearch}
      />
    )
  })

  return (
    <SimpleBar className="project-collections-list" style={{ height: '100%', overflowX: 'hidden' }}>
      {projectIsEmpty && (
        <p className="project-collections-list__notice">
          {'Your project is empty. Click '}
          <PortalLinkContainer
            to={`/search${location.search}`}
          >
            here
          </PortalLinkContainer>
          {' to return to search and add collections to your project.'}
        </p>
      )}
      {!projectIsEmpty && (
        <ul className="project-collections-list__list">
          {collectionsList}
        </ul>
      )}
      <div className="project-collections-list__filler" />
    </SimpleBar>
  )
}

ProjectCollectionsList.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  panels: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired
}

export default withRouter(ProjectCollectionsList)
