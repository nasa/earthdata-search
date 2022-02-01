import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { uniq } from 'lodash'
import {
  FaCheckCircle,
  FaCog,
  FaExclamationCircle,
  FaMap,
  FaQuestionCircle
} from 'react-icons/fa'
import { Col } from 'react-bootstrap'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import AccessMethod from '../AccessMethod/AccessMethod'
import CollectionDetails from './CollectionDetails'
import VariableTreePanel from './VariableTreePanel'
import VariableDetailsPanel from './VariableDetailsPanel'
import DataQualitySummary from '../DataQualitySummary/DataQualitySummary'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import { isAccessMethodValid } from '../../util/accessMethods'
import { locationPropType } from '../../util/propTypes/location'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'

import './ProjectPanels.scss'

/**
 * Renders ProjectPanels.
 * @param {Object} dataQualitySummaries = The dataQualitySummaries from the store.
 * @param {String} focusedCollectionId - The focused collection ID.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} panels - The current panels state.
 * @param {Object} portal - The portal from the store.
 * @param {Object} project - The project from the store.
 * @param {Object} spatial - The spatial from the store.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Object} projectCollection - The project collection.
 * @param {Function} onSetActivePanelGroup - Callback to set the page number.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onSetActivePanelGroup - Callback to set the active panel group.
 * @param {Function} onUpdateAccessMethod - Callback to update the access method.
 * @param {Function} onUpdateFocusedCollection - Callback to update the focused collection.
 * @param {Function} onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} onRemoveGranuleFromProjectCollection - Callback to remove a granule from the project.
 * @param {Function} onTogglePanels - Toggles the panels opened or closed.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 * @param {Function} onSetActivePanel - Switches the currently active panel.
 */
class ProjectPanels extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedVariable: null,
      selectedVariables: {},
      variables: null
    }

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onPanelOpen = this.onPanelOpen.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.onSelectedVariablesChange = this.onSelectedVariablesChange.bind(this)
    this.clearSelectedVariable = this.clearSelectedVariable.bind(this)
    this.onViewDetails = this.onViewDetails.bind(this)
    this.backToOptions = this.backToOptions.bind(this)
    this.resetForm = this.resetForm.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      focusedCollectionId,
      onSetActivePanelGroup,
      onTogglePanels,
      panels
    } = this.props

    const {
      project: nextProject,
      focusedCollectionId: nextFocusedCollection
    } = nextProps

    const { collections: nextProjectCollections } = nextProject
    const { byId, allIds } = nextProjectCollections

    const {
      activePanel
    } = panels

    const selectedVariables = {}

    allIds.forEach((collectionId) => {
      const { accessMethods = {}, selectedAccessMethod } = byId[collectionId]

      if (selectedAccessMethod) {
        const { [selectedAccessMethod]: accessMethod = {} } = accessMethods

        const {
          selectedVariables: nextSelectedVariables = []
        } = accessMethod

        if (nextSelectedVariables.length > 0) {
          selectedVariables[collectionId] = nextSelectedVariables
        }
      }
    })

    const nextFocusedCollectionIndex = allIds.indexOf(nextFocusedCollection).toString()
    const newFocusedCollectionIndex = activePanel.split('.')[1].toString()

    if (
      nextFocusedCollectionIndex > -1
      && nextFocusedCollectionIndex !== newFocusedCollectionIndex
    ) {
      onSetActivePanelGroup(nextFocusedCollectionIndex)
      onTogglePanels(true)
    } else if (focusedCollectionId !== nextFocusedCollection && nextFocusedCollection === '') {
      onTogglePanels(false)
    }

    this.setState({
      selectedVariables
    })
  }

  onPanelOpen() {
    const { onTogglePanels } = this.props
    onTogglePanels(true)
  }

  onPanelClose() {
    const { onTogglePanels, onUpdateFocusedCollection } = this.props
    onUpdateFocusedCollection('')
    onTogglePanels(false)
  }

  onChangePanel(activePanel) {
    const {
      onSetActivePanel,
      onTogglePanels,
      onUpdateFocusedCollection,
      project
    } = this.props

    const { collections: projectCollections } = project
    const { allIds } = projectCollections

    const newFocusedCollectionIndex = activePanel.split('.')[1]
    const newFocusedCollectionId = allIds[newFocusedCollectionIndex]

    onUpdateFocusedCollection(newFocusedCollectionId)
    onSetActivePanel(activePanel)
    onTogglePanels(true)
  }

  onCheckboxChange(e, variableId, collectionId) {
    const { selectedVariables, variables } = this.state
    let newVariables = []
    const selectedForCollection = selectedVariables[collectionId] || []

    if (variableId === 'all') {
      if (e.target.checked) {
        newVariables = [
          ...selectedForCollection,
          ...Object.keys(variables)
        ]
      } else {
        // Remove the selected variable if it exists in the selectedForCollection
        newVariables = selectedForCollection.filter((selectedVariable) => (
          Object.keys(variables).indexOf(selectedVariable) === -1
        ))
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (e.target.checked) {
        newVariables = [
          ...selectedForCollection,
          variableId
        ]
      } else {
        newVariables = selectedForCollection.filter((variable) => variable !== variableId)
      }
    }

    this.setState({
      selectedVariables: {
        ...selectedVariables,
        [collectionId]: uniq(newVariables)
      }
    })
  }

  onSelectedVariablesChange(selectedVariables, collectionId) {
    this.setState({
      selectedVariables: {
        [collectionId]: selectedVariables
      }
    })

    const { project, onUpdateAccessMethod } = this.props

    const { collections: projectCollections } = project
    const { byId: projectCollectionsById } = projectCollections
    const projectCollection = projectCollectionsById[collectionId]
    const {
      accessMethods,
      selectedAccessMethod
    } = projectCollection
    const selectedMethod = accessMethods[selectedAccessMethod]

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          ...selectedMethod,
          selectedVariables
        }
      }
    })
  }

  onViewDetails(variable, index) {
    this.setState({ selectedVariable: variable })
    this.onChangePanel(`0.${index}.2`)
  }

  backToOptions() {
    this.setState({
      variables: null
    })
  }

  clearSelectedVariable(panelId) {
    this.setState({ selectedVariable: null })
    this.onChangePanel(panelId)
  }

  canResetForm(accessMethods, selectedAccessMethod) {
    if (!accessMethods || !selectedAccessMethod) return false

    const { type = '' } = accessMethods[selectedAccessMethod]

    if (type === 'ESI' || type === 'ECHO ORDERS') return true

    return false
  }

  resetForm(collectionId, selectedAccessMethod) {
    const { onUpdateAccessMethod } = this.props

    onUpdateAccessMethod({
      collectionId,
      method: {
        [selectedAccessMethod]: {
          model: undefined,
          rawModel: undefined
        }
      }
    })
  }

  render() {
    const {
      dataQualitySummaries,
      focusedGranuleId,
      granulesMetadata,
      location,
      onChangeProjectGranulePageNum,
      onFocusedGranuleChange,
      onRemoveGranuleFromProjectCollection,
      onSelectAccessMethod,
      onSetActivePanel,
      onToggleAboutCSDAModal,
      onTogglePanels,
      onUpdateAccessMethod,
      panels,
      portal,
      project,
      projectCollectionsMetadata,
      shapefileId,
      spatial,
      temporal,
      overrideTemporal
    } = this.props

    const { selectedVariable } = this.state

    const {
      collections: projectCollections
    } = project

    const {
      allIds: projectIds,
      byId: projectCollectionsById
    } = projectCollections

    const { activePanel, isOpen } = panels
    const panelSectionEditOptions = []
    const panelSectionCollectionDetails = []

    const collectionMetadataLoaded = projectIds.some((collectionId) => {
      const { [collectionId]: collectionMetadata = {} } = projectCollectionsMetadata

      const { hasAllMetadata = false } = collectionMetadata

      return hasAllMetadata === true
    })

    projectIds.forEach((collectionId, index) => {
      const { [collectionId]: projectCollection } = projectCollectionsById

      const {
        accessMethods,
        selectedAccessMethod,
        granules: projectCollectionGranules = {}
      } = projectCollection

      const {
        allIds: granulesAllIds = [],
        hits: granuleCount
      } = projectCollectionGranules

      const { [collectionId]: collectionMetadata = {} } = projectCollectionsMetadata

      const {
        title,
        isCSDA: collectionIsCSDA
      } = collectionMetadata

      const { [collectionId]: collectionDataQualitySummaries = [] } = dataQualitySummaries

      const { valid: isValid } = isAccessMethodValid(projectCollection, collectionMetadata)

      const projectGranulesHeaderMetaPrimaryText = `Showing ${commafy(granulesAllIds.length)} of ${commafy(granuleCount)} ${pluralize('granule', granuleCount)} in project`

      const backButtonOptions = {
        text: 'Edit Options',
        location: `0.${index}.0`,
        callback: this.backToOptions
      }

      const editOptionsFooter = (
        <div className="project-panels__footer">
          {
            !isValid && (
              <span className="project-panels__collection-status project-panels__collection-status--invalid">
                <EDSCIcon icon={FaExclamationCircle} />
              </span>
            )
          }
          {
            isValid && (
              <span className="project-panels__collection-status project-panels__collection-status--valid">
                <EDSCIcon icon={FaCheckCircle} />
              </span>
            )
          }
          <span className="project-panels__collection-count">
            {`Collection ${index + 1} of ${projectIds.length}`}
          </span>
          {
            this.canResetForm(accessMethods, selectedAccessMethod) && (
              <Button
                className="project-panels__action"
                label="Previous Collection"
                bootstrapVariant="light"
                onClick={() => this.resetForm(collectionId, selectedAccessMethod)}
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
                onClick={() => this.onChangePanel(`0.${index - 1}.0`)}
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
                onClick={() => this.onChangePanel(`0.${index + 1}.0`)}
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
                onClick={() => this.onPanelClose()}
                dataTestId="project-panels-done"
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
            onClick={() => this.clearSelectedVariable(`0.${index}.1`)}
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
          headerMessage={(
            <>
              {
                collectionIsCSDA && (
                  <Col className="search-panels__note">
                    {'This collection is made available through the '}
                    <span className="search-panels__note-emph search-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                    {' for NASA funded researchers. Access to the data will require additional authentication. '}
                    <Button
                      className="search-panels__header-message-link"
                      dataTestId="search-panels__csda-modal-button"
                      onClick={() => onToggleAboutCSDAModal(true)}
                      variant="link"
                      bootstrapVariant="link"
                      icon={FaQuestionCircle}
                      label="More details"
                    >
                      More Details
                    </Button>
                  </Col>
                )
              }
            </>
          )}
          breadcrumbs={[
            {
              title,
              onClick: () => this.onChangePanel(`1.${index}.0`)
            }
          ]}
          moreActionsDropdownItems={[
            {
              title: 'View Project Granules',
              icon: FaMap,
              onClick: () => this.onChangePanel(`1.${index}.0`)
            }
          ]}
          footer={editOptionsFooter}
        >
          <PanelItem
            header={<DataQualitySummary dataQualitySummaries={collectionDataQualitySummaries} />}
          >
            <AccessMethod
              accessMethods={accessMethods}
              granuleMetadata={granulesMetadata}
              index={index}
              metadata={collectionMetadata}
              onSelectAccessMethod={onSelectAccessMethod}
              onSetActivePanel={onSetActivePanel}
              onTogglePanels={onTogglePanels}
              onUpdateAccessMethod={onUpdateAccessMethod}
              selectedAccessMethod={selectedAccessMethod}
              shapefileId={shapefileId}
              spatial={spatial}
              temporal={temporal}
              overrideTemporal={overrideTemporal}
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
              onUpdateSelectedVariables={this.onSelectedVariablesChange}
              onViewDetails={this.onViewDetails}
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
          moreActionsDropdownItems={[
            {
              title: 'Edit Project Options',
              icon: FaCog,
              onClick: () => this.onChangePanel(`0.${index}.0`)
            }
          ]}
          primaryHeading={title}
          headerMetaPrimaryText={projectGranulesHeaderMetaPrimaryText}
          headerMessage={(
            <>
              {
                collectionIsCSDA && (
                  <Col className="search-panels__note">
                    {'This collection is made available through the '}
                    <span className="search-panels__note-emph search-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                    {' for NASA funded researchers. Access to the data will require additional authentication. '}
                    <Button
                      className="search-panels__header-message-link"
                      dataTestId="search-panels__csda-modal-button"
                      onClick={() => onToggleAboutCSDAModal(true)}
                      variant="link"
                      bootstrapVariant="link"
                      icon={FaQuestionCircle}
                      label="More details"
                    >
                      More Details
                    </Button>
                  </Col>
                )
              }
            </>
          )}
        >
          <PanelItem scrollable={false}>
            <CollectionDetails
              collectionId={collectionId}
              focusedGranuleId={focusedGranuleId}
              granulesMetadata={granulesMetadata}
              location={location}
              onChangeProjectGranulePageNum={onChangeProjectGranulePageNum}
              onFocusedGranuleChange={onFocusedGranuleChange}
              onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
              portal={portal}
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
        show={collectionMetadataLoaded && isOpen}
        activePanel={activePanel}
        onPanelClose={this.onPanelClose}
        onPanelOpen={this.onPanelOpen}
        onChangePanel={this.onChangePanel}
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
}

ProjectPanels.defaultProps = {
  shapefileId: null
}

ProjectPanels.propTypes = {
  dataQualitySummaries: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangeProjectGranulePageNum: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  overrideTemporal: PropTypes.shape({}).isRequired,
  panels: PropTypes.shape({
    activePanel: PropTypes.string,
    isOpen: PropTypes.bool
  }).isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({
    collections: PropTypes.shape({})
  }).isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  temporal: PropTypes.shape({}).isRequired
}

export default ProjectPanels
