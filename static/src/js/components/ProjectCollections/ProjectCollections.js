import React from 'react'
import { PropTypes } from 'prop-types'

import projectIsValid from '../../util/isProjectValid'

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
    collectionsSearch,
    onRemoveCollectionFromProject,
    onToggleCollectionVisibility,
    onSetActivePanel,
    project,
    projectPanels
  } = props

  const collectionsLoading = collectionsSearch.isLoading
  const projectCollections = project.collectionIds.map(collectionId => project.byId[collectionId])
  const isValid = projectIsValid(projectCollections)

  return (
    <section className="project-collections">
      <ProjectHeader
        collections={collections}
        loading={collectionsLoading}
        project={project}
      />
      <ProjectCollectionsList
        collections={collections}
        loading={collectionsLoading}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onToggleCollectionVisibility={onToggleCollectionVisibility}
        onSetActivePanel={onSetActivePanel}
        project={project}
        projectPanels={projectPanels}
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
  collectionsSearch: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired
}

export default ProjectCollections
