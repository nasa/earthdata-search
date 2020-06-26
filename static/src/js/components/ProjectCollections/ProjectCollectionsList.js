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
    collectionSearch,
    location,
    mapProjection,
    onRemoveCollectionFromProject,
    onSetActivePanel,
    onToggleCollectionVisibility,
    onTogglePanels,
    onSetActivePanelSection,
    onUpdateFocusedCollection,
    panels,
    project
  } = props

  const { byId } = collections
  const {
    collectionIds: projectIds,
    byId: projectById
  } = project

  const projectIsEmpty = !projectIds.length

  const { activePanel } = panels
  const [
    activePanelSection,
    activePanelGroup
  ] = activePanel.split('.')

  const collectionsList = projectIds.map((collectionId, index) => {
    const isPanelActive = activePanelGroup === index.toString()
    const color = getColorByIndex(index)
    return (
      <ProjectCollectionItem
        collectionCount={projectIds.length}
        collectionId={collectionId}
        collection={byId[collectionId]}
        collectionSearch={collectionSearch}
        projectCollection={projectById[collectionId]}
        color={color}
        index={index}
        activePanelSection={activePanelSection}
        isPanelActive={isPanelActive}
        mapProjection={mapProjection}
        key={collectionId}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
        onUpdateFocusedCollection={onUpdateFocusedCollection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onSetActivePanel={onSetActivePanel}
        onTogglePanels={onTogglePanels}
        onSetActivePanelSection={onSetActivePanelSection}
      />
    )
  })

  return (
    <SimpleBar className="project-collections-list" style={{ height: '100%', overflowX: 'hidden' }}>
      {
        projectIsEmpty && (
          <p className="project-collections-list__notice">
            {'Your project is empty. Click '}
            <PortalLinkContainer
              to={`/search${location.search}`}
            >
              here
            </PortalLinkContainer>
            {' to return to search and add collections to your project.'}
          </p>
        )
      }
      {
        !projectIsEmpty && (
          <ul className="project-collections-list__list">
            {collectionsList}
          </ul>
        )
      }
      <div className="project-collections-list__filler" />
    </SimpleBar>
  )
}

ProjectCollectionsList.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired
}

export default withRouter(ProjectCollectionsList)
