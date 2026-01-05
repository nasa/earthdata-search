import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { parse } from 'qs'
import { isEmpty } from 'lodash-es'
import { Settings, CheckCircled } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { FaMap, FaQuestionCircle } from 'react-icons/fa'

import Col from 'react-bootstrap/Col'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'

import AccessMethod from '../AccessMethod/AccessMethod'
import CollectionDetails from './CollectionDetails'
import DataQualitySummary from '../DataQualitySummary/DataQualitySummary'
import VariableDetailsPanel from './VariableDetailsPanel'
import VariableTreePanel from './VariableTreePanel'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { changePath } from '../../util/url/changePath'
import { isAccessMethodValid } from '../../util/accessMethods'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import { routes } from '../../constants/routes'
import { MODAL_NAMES } from '../../constants/modalNames'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

import './ProjectPanels.scss'

/**
 * Renders ProjectPanels.
 */
const ProjectPanels = () => {
  const location = useLocation()
  const { search } = location

  const [selectedVariable, setSelectedVariable] = useState(null)

  // Pull values from Zustand
  const {
    dataQualitySummaries,
    isLoading,
    panels,
    projectCollections,
    selectAccessMethod,
    setActivePanel,
    setCollectionId,
    togglePanels,
    updateAccessMethod
  } = useEdscStore((state) => ({
    dataQualitySummaries: state.dataQualitySummaries.byCollectionId,
    isLoading: state.project.collections.isLoading,
    panels: state.projectPanels.panels,
    projectCollections: state.project.collections,
    selectAccessMethod: state.project.selectAccessMethod,
    setActivePanel: state.projectPanels.setActivePanel,
    setCollectionId: state.collection.setCollectionId,
    togglePanels: state.projectPanels.setIsOpen,
    updateAccessMethod: state.project.updateAccessMethod
  }))
  const projectCollectionsMetadata = useEdscStore(getProjectCollectionsMetadata)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const {
    byId: granulesQueries,
    overrideTemporal,
    spatial,
    temporal
  } = collectionQuery
  const setOpenModal = useEdscStore(setOpenModalFunction)

  // Handlers for panel open and close
  const onPanelOpen = () => {
    togglePanels(true)
  }

  // Handlers for panel open and close
  const onPanelClose = () => {
    setCollectionId(null)
    togglePanels(false)
  }

  // Handler for changing the active panel
  const onChangePanel = useCallback((activePanel) => {
    const { allIds } = projectCollections

    const newFocusedCollectionIndex = activePanel.split('.')[1]
    const newFocusedCollectionId = allIds[newFocusedCollectionIndex]

    setCollectionId(newFocusedCollectionId)
    setActivePanel(activePanel)
    togglePanels(true)
  }, [JSON.stringify(projectCollections)])

  // Handler for changing selected variables
  const onSelectedVariablesChange = useCallback((newSelectedVariables, collectionId) => {
    const { byId: projectCollectionsById } = projectCollections
    const projectCollection = projectCollectionsById[collectionId]
    const {
      accessMethods,
      selectedAccessMethod
    } = projectCollection
    const selectedMethod = accessMethods[selectedAccessMethod]

    updateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          ...selectedMethod,
          selectedVariables: newSelectedVariables
        }
      }
    })
  }, [JSON.stringify(projectCollections)])

  // Handler for viewing details of a variable
  const onViewDetails = (variable, index) => {
    setSelectedVariable(variable)
    onChangePanel(`0.${index}.2`)
  }

  // Handler for clearing the selected variable
  const clearSelectedVariable = (panelId) => {
    setSelectedVariable(null)
    onChangePanel(panelId)
  }

  // Function to check if the form can be reset
  const canResetForm = (accessMethods, selectedAccessMethod) => {
    if (!accessMethods || !selectedAccessMethod) return false

    const { type = '' } = accessMethods[selectedAccessMethod]

    if (type === 'ESI' || type === 'ECHO ORDERS') return true

    return false
  }

  // Function to reset the form
  const resetForm = (collectionId, selectedAccessMethod) => {
    updateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          model: undefined,
          rawModel: undefined
        }
      }
    })
  }

  const {
    allIds: projectIds,
    byId: projectCollectionsById
  } = projectCollections

  const { activePanel, isOpen } = panels

  const panelSectionCollectionDetails = []
  const panelSectionEditOptions = []

  // Iterate over each project collection ID to add panel sections
  projectIds.forEach((collectionId, index) => {
    const { [collectionId]: projectCollection } = projectCollectionsById

    const {
      accessMethods,
      selectedAccessMethod,
      granules: projectCollectionGranules = {}
    } = projectCollection

    const {
      allIds: granulesAllIds = [],
      count: granuleCount
    } = projectCollectionGranules

    const { [collectionId]: collectionMetadata = {} } = projectCollectionsMetadata

    const {
      title,
      isCSDA: collectionIsCSDA,
      cloudHosted,
      duplicateCollections = []
    } = collectionMetadata

    const { granules: granulesQuery = {} } = granulesQueries[collectionId] || {}
    const { temporal: granuleTemporal = {} } = granulesQuery

    // Default the preferredTemporal to global temporal
    let preferredTemporal = temporal

    // If overrideTemporal is provided, use that value
    if (!isEmpty(overrideTemporal)) preferredTemporal = overrideTemporal
    // If granuleTemporal is provided, use that value
    if (!isEmpty(granuleTemporal)) preferredTemporal = granuleTemporal

    let { [collectionId]: collectionDataQualitySummaries = [] } = dataQualitySummaries

    const hasDataQualitySummary = collectionDataQualitySummaries.length > 0

    const hasDuplicateCollection = duplicateCollections.length > 0

    const dataQualityHeader = (() => {
      if (hasDataQualitySummary && hasDuplicateCollection) {
        return 'Important data quality and availability information'
      }

      if (hasDataQualitySummary) {
        return 'Important data quality information'
      }

      if (hasDuplicateCollection) {
        return 'Important data availability information'
      }

      return ''
    })()

    if (hasDuplicateCollection) {
      const duplicateCollectionId = duplicateCollections[0]

      const params = parse(search, {
        parseArrays: false,
        ignoreQueryPrefix: true
      })

      // Adding duplicateCollectionId to the front makes it the focused collection
      const p = [duplicateCollectionId, ...projectIds].join('!')

      const newSearch = stringify({
        ...params,
        p
      })

      const navigateToDuplicateCollection = () => {
        changePath(`${routes.GRANULES}${newSearch}`)
      }

      collectionDataQualitySummaries = [...collectionDataQualitySummaries, {
        id: 'duplicate-collection',
        summary: cloudHosted
          ? (
            <>
              <span>This dataset is hosted in the Earthdata Cloud. The dataset is also </span>
              <PortalLinkContainer
                to={
                  {
                    pathname: routes.GRANULES,
                    search: newSearch
                  }
                }
                onClick={navigateToDuplicateCollection}
              >
                hosted in a NASA datacenter
              </PortalLinkContainer>
              <span>, and may have different services available.</span>
            </>
          )
          : (
            <>
              <span>This dataset is hosted inside a NASA datacenter. The dataset is also </span>
              <PortalLinkContainer
                to={
                  {
                    pathname: routes.GRANULES,
                    search: newSearch
                  }
                }
                onClick={navigateToDuplicateCollection}
              >
                hosted in the Earthdata Cloud
              </PortalLinkContainer>
              <span>, and may have different services available.</span>
            </>
          )
      }]
    }

    const { valid: isValid } = isAccessMethodValid(projectCollection, collectionMetadata)

    const projectGranulesHeaderMetaPrimaryText = `Showing ${commafy(granulesAllIds.length)} of ${commafy(granuleCount)} ${pluralize('granule', granuleCount)} in project`

    const backButtonOptions = {
      text: 'Edit Options',
      location: `0.${index}.0`
    }

    const editOptionsFooter = (
      <div className="project-panels__footer">
        {
          !isValid && (
            <span className="project-panels__collection-status project-panels__collection-status--invalid">
              <EDSCIcon icon={AlertInformation} />
            </span>
          )
        }
        {
          isValid && (
            <span className="project-panels__collection-status project-panels__collection-status--valid">
              <EDSCIcon icon={CheckCircled} />
            </span>
          )
        }
        <span className="project-panels__collection-count">
          {`Collection ${index + 1} of ${projectIds.length}`}
        </span>
        {
          canResetForm(accessMethods, selectedAccessMethod) && (
            <Button
              className="project-panels__action"
              label="Reset Form"
              bootstrapVariant="light"
              onClick={() => resetForm(collectionId, selectedAccessMethod)}
            >
              Reset Form
            </Button>
          )
        }
        {
          index > 0 && (
            <Button
              className="project-panels__action"
              label="Previous Collection"
              bootstrapVariant="light"
              onClick={() => onChangePanel(`0.${index - 1}.0`)}
            >
              Back
            </Button>
          )
        }
        {
          index < projectIds.length - 1 && (
            <Button
              className="project-panels__action"
              label="Next Collection"
              bootstrapVariant="primary"
              onClick={() => onChangePanel(`0.${index + 1}.0`)}
            >
              Next
            </Button>
          )
        }
        {
          index === projectIds.length - 1 && (
            <Button
              className="project-panels__action"
              label="Done"
              bootstrapVariant="primary"
              onClick={onPanelClose}
            >
              Done
            </Button>
          )
        }
      </div>
    )

    const variableDetailsFooter = (
      <div className="project-panels__footer">
        <Button
          type="button"
          label="Back"
          bootstrapVariant="primary"
          className="project-panels__action"
          onClick={() => clearSelectedVariable(`0.${index}.1`)}
        >
          Back
        </Button>
      </div>
    )

    // Panels are controlled using the onSetActivePanel action. The parameters are
    // dot separated indexes of the panel you would like to trigger.
    // They should be passed like so:
    // {'{Panel Section ID}.{Panel Group ID}.{Panel Item ID}'}
    panelSectionEditOptions.push(
      <PanelGroup
        key={`${collectionId}_edit-options`}
        primaryHeading="Edit Options"
        headerLoading={isLoading}
        headerMessage={
          (
            // TODO EDSC-4611 move this code
            collectionIsCSDA && (
              <Col className="project-panels__note mx-3">
                {'This collection is made available through the '}
                <span className="project-panels__note-emph project-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                {' for NASA funded researchers. Access to the data will require additional authentication. '}
                <Button
                  className="project-panels__header-message-link"
                  onClick={() => setOpenModal(MODAL_NAMES.ABOUT_CSDA)}
                  variant="link"
                  bootstrapVariant="link"
                  icon={FaQuestionCircle}
                  label="More details"
                >
                  More Details
                </Button>
              </Col>
            )
          )
        }
        breadcrumbs={
          [
            {
              title,
              onClick: () => onChangePanel(`1.${index}.0`),
              isLoading
            }
          ]
        }
        moreActionsDropdownItems={
          [
            {
              title: 'View Project Granules',
              icon: FaMap,
              onClick: () => onChangePanel(`1.${index}.0`)
            }
          ]
        }
        footer={editOptionsFooter}
      >
        <PanelItem
          header={
            (
              <DataQualitySummary
                dataQualitySummaries={collectionDataQualitySummaries}
                dataQualityHeader={dataQualityHeader}
              />
            )
          }
        >
          <AccessMethod
            accessMethods={accessMethods}
            index={index}
            metadata={collectionMetadata}
            onSelectAccessMethod={selectAccessMethod}
            onSetActivePanel={setActivePanel}
            onTogglePanels={togglePanels}
            onUpdateAccessMethod={updateAccessMethod}
            selectedAccessMethod={selectedAccessMethod}
            spatial={spatial}
            temporal={preferredTemporal}
            projectCollection={projectCollection}
          />
        </PanelItem>
        <PanelItem
          hideFooter
          backButtonOptions={backButtonOptions}
        >
          <VariableTreePanel
            accessMethods={accessMethods}
            collectionId={collectionId}
            index={index}
            selectedAccessMethod={selectedAccessMethod}
            onUpdateSelectedVariables={onSelectedVariablesChange}
            onViewDetails={onViewDetails}
          />
        </PanelItem>
        <PanelItem
          footer={variableDetailsFooter}
          backButtonOptions={backButtonOptions}
        >
          <VariableDetailsPanel
            variable={selectedVariable}
          />
        </PanelItem>
      </PanelGroup>
    )

    panelSectionCollectionDetails.push(
      <PanelGroup
        key={`${collectionId}_collection-details`}
        moreActionsDropdownItems={
          [
            {
              title: 'Edit Project Options',
              icon: Settings,
              onClick: () => onChangePanel(`0.${index}.0`)
            }
          ]
        }
        primaryHeading={title}
        headerMetaPrimaryText={projectGranulesHeaderMetaPrimaryText}
        headerMessage={
          (
            // TODO EDSC-4611 move this code
            collectionIsCSDA && (
              <Col className="project-panels__note mx-3">
                {'This collection is made available through the '}
                <span className="project-panels__note-emph project-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                {' for NASA funded researchers. Access to the data will require additional authentication. '}
                <Button
                  className="project-panels__header-message-link"
                  onClick={() => setOpenModal(MODAL_NAMES.ABOUT_CSDA)}
                  variant="link"
                  bootstrapVariant="link"
                  icon={FaQuestionCircle}
                  label="More details"
                >
                  More Details
                </Button>
              </Col>
            )
          )
        }
      >
        <PanelItem scrollable={false}>
          <CollectionDetails
            collectionId={collectionId}
            projectCollection={projectCollection}
          />
        </PanelItem>
      </PanelGroup>
    )
  })

  // Don't display the panels if the project doesn't have any collections
  if (projectIds.length === 0) return null

  return (
    <Panels
      draggable
      show={isOpen}
      activePanel={activePanel}
      onPanelClose={onPanelClose}
      onPanelOpen={onPanelOpen}
      onChangePanel={onChangePanel}
    >
      <PanelSection>
        {panelSectionEditOptions}
      </PanelSection>
      <PanelSection>
        {panelSectionCollectionDetails}
      </PanelSection>
    </Panels>
  )
}

export default ProjectPanels
