import React from 'react'
import { PropTypes } from 'prop-types'

import { isProjectValid } from '../../util/isProjectValid'

import Button from '../Button/Button'
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
    collectionSearch,
    collectionsSearchResults,
    project,
    projectPanels,
    savedProject,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel,
    onUpdateProjectName
  } = props

  const collectionsLoading = collectionsSearchResults.isLoading
  const projectCollections = project.collectionIds.map(collectionId => project.byId[collectionId])
  const isValid = isProjectValid(projectCollections)

  return (
    <section className="project-collections">
      <ProjectHeader
        collections={collections}
        project={project}
        savedProject={savedProject}
        onUpdateProjectName={onUpdateProjectName}
      />
      <ProjectCollectionsList
        collections={collections}
        loading={collectionsLoading}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
        onSetActivePanel={onSetActivePanel}
        project={project}
        projectPanels={projectPanels}
        collectionSearch={collectionSearch}
      />
      <div className="project-collections__footer">
        <p className="project-collections__footer-message">
          {
            !isValid && (
              <>
                Select a data access method for each collection in your project before downloading.
              </>
            )
          }
          {
            isValid && (
              <>
                Click &quot;Edit Options&quot; above to customize the output for each project.
              </>
            )
          }
        </p>
        <Button
          type="submit"
          variant="full"
          bootstrapVariant="success"
          icon="download"
          label="Download project data"
          disabled={!isValid}
        >
          Download Data
        </Button>
      </div>
    </section>
  )
}

ProjectCollections.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  collectionsSearchResults: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired
}

export default ProjectCollections
