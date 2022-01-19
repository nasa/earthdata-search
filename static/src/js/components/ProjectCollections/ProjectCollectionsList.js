import React from 'react'
import { PropTypes } from 'prop-types'
import { withRouter } from 'react-router-dom'

import SimpleBar from 'simplebar-react'

import { getColorByIndex } from '../../util/colors'
import { locationPropType } from '../../util/propTypes/location'

import ProjectCollectionItem from './ProjectCollectionItem'
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
    collectionsMetadata,
    collectionsQuery,
    handoffs,
    location,
    mapProjection,
    onRemoveCollectionFromProject,
    onSetActivePanel,
    onSetActivePanelSection,
    onToggleCollectionVisibility,
    onTogglePanels,
    onUpdateFocusedCollection,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panels,
    project
  } = props

  const { collections: projectCollections } = project
  const {
    allIds: projectIds,
    byId: projectById
  } = projectCollections

  const projectIsEmpty = !projectIds.length

  const { activePanel } = panels
  const [
    activePanelSection,
    activePanelGroup
  ] = activePanel.split('.')

  const collectionsList = projectIds.map((collectionId, index) => {
    const isPanelActive = activePanelGroup === index.toString()
    const color = getColorByIndex(index)

    const { [collectionId]: projectCollectionMetadata = {} } = collectionsMetadata
    const { [collectionId]: projectCollection = {} } = projectById

    return (
      <ProjectCollectionItem
        activePanelSection={activePanelSection}
        collectionMetadata={projectCollectionMetadata}
        collectionCount={projectIds.length}
        collectionId={collectionId}
        collectionsQuery={collectionsQuery}
        color={color}
        handoffs={handoffs}
        index={index}
        isPanelActive={isPanelActive}
        key={collectionId}
        mapProjection={mapProjection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onSetActivePanel={onSetActivePanel}
        onSetActivePanelSection={onSetActivePanelSection}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
        onTogglePanels={onTogglePanels}
        onUpdateFocusedCollection={onUpdateFocusedCollection}
        onViewCollectionDetails={onViewCollectionDetails}
        onViewCollectionGranules={onViewCollectionGranules}
        projectCollection={projectCollection}
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
  collectionsMetadata: PropTypes.shape({}).isRequired,
  collectionsQuery: PropTypes.shape({}).isRequired,
  handoffs: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  mapProjection: PropTypes.string.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({
    activePanel: PropTypes.string
  }).isRequired,
  project: PropTypes.shape({
    collections: PropTypes.shape({})
  }).isRequired
}

export default withRouter(ProjectCollectionsList)
