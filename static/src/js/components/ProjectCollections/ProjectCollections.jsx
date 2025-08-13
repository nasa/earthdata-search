import React, { useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { isProjectValid } from '../../util/isProjectValid'

import Button from '../Button/Button'
import ProjectHeader from './ProjectHeader'
import ProjectCollectionsList from './ProjectCollectionsList'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

import './ProjectCollections.scss'

/**
 * Renders ProjectCollections.
 * @param {Function} onMetricsDataAccess - Callback to log metrics events.
 * @param {Function} onUpdateFocusedCollection - Callback to update the focused collection.
 * @param {Function} onUpdateProjectName - Callback to update the project name.
 * @param {Function} onViewCollectionDetails - Callback to view collection details.
 * @param {Function} onViewCollectionGranules - Callback to view collection granules.
 * @param {Object} savedProject - The saved project state.
 */
const ProjectCollections = ({
  onMetricsDataAccess,
  onUpdateProjectName,
  savedProject
}) => {
  const {
    panels: panelsData,
    setActivePanel,
    togglePanels,
    setPanelSection,
    collections: projectCollections,
    isSubmitting
  } = useEdscStore((state) => ({
    collections: state.project.collections,
    isSubmitting: state.project.isSubmitting,
    panels: state.projectPanels.panels,
    setActivePanel: state.projectPanels.setActivePanel,
    togglePanels: state.projectPanels.setIsOpen,
    setPanelSection: state.projectPanels.setPanelSection
  }))
  const { allIds: projectCollectionsIds } = projectCollections
  const projectCollectionsMetadata = useEdscStore(getProjectCollectionsMetadata)
  const collectionsQuery = useEdscStore(getCollectionsQuery)

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
        savedProject={savedProject}
        onUpdateProjectName={onUpdateProjectName}
      />
      <ProjectCollectionsList
        collectionsMetadata={projectCollectionsMetadata}
        onMetricsDataAccess={onMetricsDataAccess}
        onSetActivePanel={setActivePanel}
        onSetActivePanelSection={setPanelSection}
        onTogglePanels={togglePanels}
        panels={panelsData}
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
  onMetricsDataAccess: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default ProjectCollections
