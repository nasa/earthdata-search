import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { uniq } from 'lodash'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import AccessMethod from '../AccessMethod/AccessMethod'
import CollectionDetails from './CollectionDetails'
import VariableKeywordPanel from './VariableKeywordPanel'
import VariablesPanel from './VariablesPanel'
import VariableDetailsPanel from './VariableDetailsPanel'
import DataQualitySummary from '../DataQualitySummary/DataQualitySummary'

import { isAccessMethodValid } from '../../util/accessMethods'

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
 * @param {Function} onSetActivePanel - Switches the currently active panel.
 */
class ProjectPanels extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedKeyword: null,
      selectedVariable: null,
      selectedVariables: {},
      variables: null
    }

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onPanelOpen = this.onPanelOpen.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.selectKeyword = this.selectKeyword.bind(this)
    this.onSaveVariables = this.onSaveVariables.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.clearSelectedKeyword = this.clearSelectedKeyword.bind(this)
    this.clearSelectedVariable = this.clearSelectedVariable.bind(this)
    this.onViewDetails = this.onViewDetails.bind(this)
    this.backToOptions = this.backToOptions.bind(this)
    this.resetForm = this.resetForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
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
      const { accessMethods = {} } = byId[collectionId]
      const { opendap } = accessMethods

      if (!opendap) return

      const { selectedVariables: nextSelectedVariables = [] } = opendap

      if (nextSelectedVariables.length > 0) {
        selectedVariables[collectionId] = nextSelectedVariables
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
        newVariables = selectedForCollection.filter(selectedVariable => (
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
        newVariables = selectedForCollection.filter(variable => variable !== variableId)
      }
    }

    this.setState({
      selectedVariables: {
        ...selectedVariables,
        [collectionId]: uniq(newVariables)
      }
    })
  }

  onSaveVariables(collectionId, index) {
    const { selectedVariables } = this.state
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
          selectedVariables: selectedVariables[collectionId]
        }
      }
    })

    this.onChangePanel(`0.${index}.1`)
  }

  onViewDetails(variable, index) {
    this.setState({ selectedVariable: variable })
    this.onChangePanel(`0.${index}.3`)
  }

  backToOptions() {
    this.setState({ selectedKeyword: null, variables: null })
  }

  selectKeyword(keyword, variables, index) {
    this.setState({
      selectedKeyword: keyword,
      variables
    })
    this.onChangePanel(`0.${index}.2`)
  }

  clearSelectedKeyword(panelId) {
    this.setState({ selectedKeyword: null, variables: null })
    this.onChangePanel(panelId)
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
      onUpdateAccessMethod,
      onTogglePanels,
      onViewCollectionGranules,
      panels,
      portal,
      project,
      projectCollectionsMetadata,
      shapefileId,
      spatial
    } = this.props

    const {
      selectedKeyword,
      selectedVariable,
      selectedVariables,
      variables
    } = this.state

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
        selectedAccessMethod
      } = projectCollection

      const { [collectionId]: collectionMetadata = {} } = projectCollectionsMetadata

      const {
        title
      } = collectionMetadata

      const { [collectionId]: collectionDataQualitySummaries = [] } = dataQualitySummaries

      const { valid: isValid } = isAccessMethodValid(projectCollection, collectionMetadata)

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
                <i className="fa fa-exclamation-circle" />
              </span>
            )
          }
          {
            isValid && (
              <span className="project-panels__collection-status project-panels__collection-status--valid">
                <i className="fa fa-check-circle" />
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

      const variablePanelFooter = (
        <div className="project-panels__footer">
          <Button
            type="button"
            label="Back"
            bootstrapVariant="light"
            className="project-panels__action"
            onClick={() => this.clearSelectedKeyword(`0.${index}.1`)}
          >
            Back
          </Button>
          <Button
            type="button"
            label="Save"
            bootstrapVariant="primary"
            className="project-panels__action"
            onClick={() => this.onSaveVariables(collectionId, index)}
          >
            Save
          </Button>
        </div>
      )

      const variableDetailsFooter = (
        <div className="project-panels__footer">
          <Button
            type="button"
            label="Back"
            bootstrapVariant="primary"
            className="project-panels__action"
            onClick={() => this.clearSelectedVariable(`0.${index}.2`)}
          >
            Back
          </Button>
        </div>
      )

      const projectHeadingLink = (
        <Button
          className="panel-group-header__heading-primary-link"
          label="View Granules"
          onClick={() => { onViewCollectionGranules(collectionId) }}
        >
          <i className="fa fa-map" />
          {' View Granules'}
        </Button>
      )

      // Panels are controlled using the onSetActivePanel action. The parameters are
      // dot separated indexes of the panel you would like to trigger.
      // They should be passed like so:
      // {'{Panel Section ID}.{Panel Group ID}.{Panel Item ID}'}
      panelSectionEditOptions.push(
        <PanelGroup
          key={`${collectionId}_edit-options`}
          headingLink={projectHeadingLink}
          primaryHeading={title}
          secondaryHeading="Edit Options"
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
            />
          </PanelItem>
          <PanelItem
            hideFooter
            backButtonOptions={backButtonOptions}
          >
            <VariableKeywordPanel
              accessMethods={accessMethods}
              index={index}
              selectedAccessMethod={selectedAccessMethod}
              onSelectKeyword={this.selectKeyword}
            />
          </PanelItem>
          <PanelItem
            footer={variablePanelFooter}
            backButtonOptions={backButtonOptions}
          >
            <VariablesPanel
              index={index}
              collectionId={collectionId}
              selectedKeyword={selectedKeyword}
              selectedVariables={selectedVariables[collectionId]}
              variables={variables}
              onCheckboxChange={this.onCheckboxChange}
              onClearSelectedKeyword={this.clearSelectedKeyword}
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
          headingLink={projectHeadingLink}
          primaryHeading={title}
          secondaryHeading="Details"
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
  location: PropTypes.shape({}).isRequired,
  onChangeProjectGranulePageNum: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired
}

export default ProjectPanels
