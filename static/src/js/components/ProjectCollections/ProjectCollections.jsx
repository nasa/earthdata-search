import React, { useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { isProjectValid } from '../../util/isProjectValid'

import Button from '../Button/Button'
import ProjectHeader from './ProjectHeader'
import ProjectCollectionsList from './ProjectCollectionsList'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

import './ProjectCollections.scss'

/**
 * Renders ProjectCollections.
 * @param {Object} collections - List of collections passed from redux store.
 * @param {String} collectionsQuery - The collection search.
 * @param {String} map - The current map configuration.
 * @param {Function} onMetricsDataAccess - Callback to log metrics events.
 * @param {Function} onSetActivePanel - Callback to set the active panel.
 * @param {Function} onSetActivePanelSection - Callback to set the active panel section.
 * @param {Function} onTogglePanels - Callback to toggle the visibility of the panels.
 * @param {Function} onUpdateProjectName - Callback to update the project name.
 * @param {Object} panels - The panels state.
 * @param {Object} project - The project state.
 * @param {Object} savedProject - The saved project state.
 */
const ProjectCollections = ({
  collectionsQuery,
  onMetricsDataAccess,
  onSetActivePanel,
  onSetActivePanelSection,
  onTogglePanels,
  onUpdateFocusedCollection,
  onUpdateProjectName,
  onViewCollectionDetails,
  onViewCollectionGranules,
  panels,
  savedProject
}) => {
  const {
    collections: projectCollections,
    isSubmitting
  } = useEdscStore((state) => ({
    collections: state.project.collections,
    isSubmitting: state.project.isSubmitting
  }))
  const { allIds: projectCollectionsIds } = projectCollections
  const projectCollectionsMetadata = useEdscStore(getProjectCollectionsMetadata)

  useEffect(() => {
    projectCollectionsIds.forEach((id) => {
      onMetricsDataAccess({
        type: 'data_access_init',
        collections: [{
          collectionId: id
        }]
      })
    })
  }, [])

  const {
    valid: isValid,
    noGranules,
    tooManyGranules,
    needsCustomization
  } = isProjectValid(
    projectCollections,
    projectCollectionsMetadata
  )

  const isLoading = projectCollectionsIds.every((collectionId) => {
    const { byId = {} } = collectionsQuery
    const { [collectionId]: collectionSearch = {} } = byId
    const { granules = {} } = collectionSearch
    const { isLoading: granulesIsLoading } = granules

    return granulesIsLoading
  })

  return (
    <section className="project-collections">
      <ProjectHeader
        collectionsQuery={collectionsQuery}
        savedProject={savedProject}
        onUpdateProjectName={onUpdateProjectName}
      />
      <ProjectCollectionsList
        collectionsMetadata={projectCollectionsMetadata}
        collectionsQuery={collectionsQuery}
        onMetricsDataAccess={onMetricsDataAccess}
        onSetActivePanel={onSetActivePanel}
        onSetActivePanelSection={onSetActivePanelSection}
        onTogglePanels={onTogglePanels}
        onUpdateFocusedCollection={onUpdateFocusedCollection}
        onViewCollectionDetails={onViewCollectionDetails}
        onViewCollectionGranules={onViewCollectionGranules}
        panels={panels}
      />
      <div className="project-collections__footer">
        {
          !isLoading && (
            <p className="project-collections__footer-message">
              {
                !isValid && !tooManyGranules && !noGranules && !needsCustomization && (
                  'Select a data access method for each collection in your project before downloading.'
                )
              }
              {
                !isValid && needsCustomization && (
                  'One or more collections in your project have an access method selected that requires customization options. Please select a customization option or choose a different access method.'
                )
              }
              {
                isValid && (
                  `Click ${String.fromCharCode(8220)}Edit Options${String.fromCharCode(8221)} above to customize the output for each project.`
                )
              }
              {
                !isValid && tooManyGranules && (
                  'One or more collections in your project contains too many granules. Adjust temporal constraints or remove the collections before downloading.'
                )
              }
              {
                !isValid && noGranules && (
                  'One or more collections in your project does not contain granules. Adjust temporal constraints or remove the collections before downloading.'
                )
              }
            </p>
          )
        }

        <Button
          type="submit"
          variant="full"
          icon={Download}
          bootstrapVariant="primary"
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

ProjectCollections.propTypes = {
  collectionsQuery: PropTypes.shape({
    byId: PropTypes.shape({})
  }).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default ProjectCollections
