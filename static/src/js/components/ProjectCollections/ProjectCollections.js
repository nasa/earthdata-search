import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { isEqual } from 'lodash'

import { isProjectValid } from '../../util/isProjectValid'

import Button from '../Button/Button'
import ProjectHeader from './ProjectHeader'
import ProjectCollectionsList from './ProjectCollectionsList'

import './ProjectCollections.scss'

/**
 * Renders ProjectCollections.
 * @param {Object} collections - List of collections passed from redux store.
 * @param {String} collectionSearch - The collection search.
 * @param {String} mapProjection - The current map projection.
 * @param {Function} onMetricsDataAccess - Callback to log metrics events.
 * @param {Function} onRemoveCollectionFromProject - Callback to remove the current collection from the project.
 * @param {Function} onSetActivePanel - Callback to set the active panel.
 * @param {Function} onSetActivePanelSection - Callback to set the active panel section.
 * @param {Function} onTogglePanels - Callback to toggle the visibility of the panels.
 * @param {Function} onToggleCollectionVisibility - Callback to toggle the visibility of the collection.
 * @param {Function} onUpdateProjectName - Callback to update the projet name.
 * @param {Object} panels - The panels state.
 * @param {Object} project - The project state.
 * @param {Object} savedProject - The saved project state.
 */
export class ProjectCollections extends Component {
  constructor() {
    super()

    this.sentDataAccessMetrics = false
    this.sendDataAccessMetrics = this.sendDataAccessMetrics.bind(this)
  }

  componentDidMount() {
    this.sentDataAccessMetrics = false
  }

  componentDidUpdate(prevProps) {
    const { project } = prevProps
    const { project: nextProject } = this.props

    if (!this.sentDataAccessMetrics && !isEqual(project, nextProject)) {
      this.sendDataAccessMetrics()
    }
  }

  componentWillUnmount() {
    this.sentDataAccessMetrics = false
  }

  sendDataAccessMetrics() {
    const { project, onMetricsDataAccess } = this.props
    const projectCollectionIds = project.collectionIds
    projectCollectionIds.forEach((id) => {
      onMetricsDataAccess({
        type: 'data_access_init',
        collections: [{
          collectionId: id
        }]
      })
    })

    this.sentDataAccessMetrics = true
  }

  render() {
    const {
      collections,
      collectionSearch,
      mapProjection,
      onMetricsDataAccess,
      onRemoveCollectionFromProject,
      onSetActivePanel,
      onSetActivePanelSection,
      onToggleCollectionVisibility,
      onTogglePanels,
      onUpdateFocusedCollection,
      onUpdateProjectName,
      panels,
      project,
      savedProject
    } = this.props

    const {
      valid: isValid,
      noGranules,
      tooManyGranules
    } = isProjectValid(project, collections)
    const { isSubmitting } = project

    // TODO: Use a loading state instead of relying on metadata keys
    const isLoading = collections.allIds.every((collectionId) => {
      const { byId } = collections
      const collection = byId[collectionId]
      const { granules = {} } = collection

      return Object.keys(granules).length === 0
    })

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
          onMetricsDataAccess={onMetricsDataAccess}
          onRemoveCollectionFromProject={onRemoveCollectionFromProject}
          onToggleCollectionVisibility={onToggleCollectionVisibility}
          onSetActivePanel={onSetActivePanel}
          onTogglePanels={onTogglePanels}
          onSetActivePanelSection={onSetActivePanelSection}
          onUpdateFocusedCollection={onUpdateFocusedCollection}
          project={project}
          panels={panels}
          collectionSearch={collectionSearch}
          mapProjection={mapProjection}
        />
        <div className="project-collections__footer">
          {
            !isLoading && (
              <p className="project-collections__footer-message">
                {
                  !isValid && !tooManyGranules && !noGranules && (
                    <>
                      {'Select a data access method for each collection in your project before downloading.'}
                    </>
                  )
                }
                {
                  isValid && (
                    <>
                      {`Click ${String.fromCharCode(8220)}Edit Options${String.fromCharCode(8221)} above to customize the output for each project.`}
                    </>
                  )
                }
                {
                  !isValid && tooManyGranules && (
                    <>
                      {'One or more collections in your project contains too many granules. Adjust temporal constraints or remove the collections before downloading.'}
                    </>
                  )
                }
                {
                  !isValid && noGranules && (
                    <>
                      {'One or more collections in your project does not contain granules. Adjust temporal constraints or remove the collections before downloading.'}
                    </>
                  )
                }
              </p>
            )
          }

          <Button
            type="submit"
            variant="full"
            bootstrapVariant="success"
            icon="download"
            label="Download project data"
            disabled={!isValid}
            spinner={isSubmitting}
            dataTestId="project-download-data"
          >
            Download Data
          </Button>
        </div>
      </section>
    )
  }
}

ProjectCollections.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default ProjectCollections
