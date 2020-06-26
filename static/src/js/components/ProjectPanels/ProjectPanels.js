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
 * @param {Object} collections - The collections from the store.
 * @param {Object} dataQualitySummaries = The dataQualitySummaries from the store.
 * @param {String} focusedCollection - The focused collection ID.
 * @param {String} focusedGranule - The focused granule ID.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} granuleQuery - The granule query from the store.
 * @param {Object} location - The location from the store.
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
      focusedCollection,
      onSetActivePanelGroup,
      onTogglePanels,
      panels
    } = this.props
    const {
      project: nextProject,
      focusedCollection: nextFocusedCollection
    } = nextProps
    const { byId, collectionIds } = nextProject

    const {
      activePanel
    } = panels

    const selectedVariables = {}

    collectionIds.forEach((collectionId) => {
      const { accessMethods = {} } = byId[collectionId]
      const { opendap } = accessMethods

      if (!opendap) return

      const { selectedVariables: nextSelectedVariables = [] } = opendap

      if (nextSelectedVariables.length > 0) {
        selectedVariables[collectionId] = nextSelectedVariables
      }
    })

    const nextFocusedCollectionIndex = collectionIds.indexOf(nextFocusedCollection).toString()
    const newFocusedCollectionIndex = activePanel.split('.')[1].toString()

    if (nextFocusedCollectionIndex > -1 && nextFocusedCollectionIndex !== newFocusedCollectionIndex) {
      onSetActivePanelGroup(nextFocusedCollectionIndex)
      onTogglePanels(true)
    } else if (focusedCollection !== nextFocusedCollection && nextFocusedCollection === '') {
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
    const { collectionIds } = project

    console.log('activePanel', activePanel)

    const newFocusedCollectionIndex = activePanel.split('.')[1]
    const newFocusedCollectionId = collectionIds[newFocusedCollectionIndex]

    console.log('newFocusedCollectionId', newFocusedCollectionId)

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
    console.log('onSaveVariables', index)
    const { selectedVariables } = this.state
    const { project, onUpdateAccessMethod } = this.props

    const { byId: projectById } = project
    const projectCollection = projectById[collectionId]
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
      collections,
      dataQualitySummaries,
      focusedGranule,
      granuleQuery,
      location,
      portal,
      project,
      panels,
      shapefileId,
      spatial,
      onChangeGranulePageNum,
      onSelectAccessMethod,
      onSetActivePanel,
      onUpdateAccessMethod,
      onRemoveGranuleFromProjectCollection,
      onFocusedGranuleChange
    } = this.props

    const {
      selectedKeyword,
      selectedVariable,
      selectedVariables,
      variables
    } = this.state

    const { byId = {} } = collections
    const { collectionIds: projectIds, byId: projectById } = project

    const { activePanel, isOpen } = panels
    const panelSectionEditOptions = []
    const panelSectionCollectionDetails = []

    let loaded = false

    // TODO: Figure out a more reliable way of determining if the metadata is loaded
    let collectionMetadataLoaded = Object.values(byId).some((collection) => {
      const { metadata = {} } = collection
      return Object.prototype.hasOwnProperty.call(metadata, 'title')
    })

    projectIds.forEach((collectionId, index) => {
      loaded = true
      const collection = byId[collectionId]
      if (!collection || Object.keys(collection).length === 0) return

      const projectCollection = projectById[collectionId]
      const { metadata, granules } = collection

      if (!collectionMetadataLoaded) return

      collectionMetadataLoaded = true

      const {
        title = '',
        conceptId: id
      } = metadata

      const { [id]: collectionDataQualitySummaries = [] } = dataQualitySummaries

      const {
        accessMethods,
        selectedAccessMethod
      } = projectCollection

      const { valid: isValid } = isAccessMethodValid(projectCollection, collection)

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
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: clearKeyword"
          >
            Back
          </Button>
          <Button
            type="button"
            label="Save"
            bootstrapVariant="primary"
            className="project-panels__action"
            onClick={() => this.onSaveVariables(collectionId, index)}
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: saveState"
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
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: clearKeyword"
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
          key={`${id}_edit-options`}
          primaryHeading={title}
          secondaryHeading="Edit Options"
          footer={editOptionsFooter}
        >
          <PanelItem
            header={<DataQualitySummary dataQualitySummaries={collectionDataQualitySummaries} />}
          >
            <AccessMethod
              accessMethods={accessMethods}
              index={index}
              metadata={metadata}
              granuleMetadata={granules}
              shapefileId={shapefileId}
              spatial={spatial}
              onSelectAccessMethod={onSelectAccessMethod}
              onSetActivePanel={onSetActivePanel}
              onUpdateAccessMethod={onUpdateAccessMethod}
              selectedAccessMethod={selectedAccessMethod}
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
          key={`${id}_collection-details`}
          primaryHeading={title}
          secondaryHeading="Details"
        >
          <PanelItem scrollable={false}>
            <CollectionDetails
              granules={granules}
              granuleQuery={granuleQuery}
              collection={collection}
              collectionId={collectionId}
              focusedGranule={focusedGranule}
              location={location}
              portal={portal}
              projectCollection={projectCollection}
              onChangeGranulePageNum={onChangeGranulePageNum}
              onFocusedGranuleChange={onFocusedGranuleChange}
              onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
            />
          </PanelItem>
        </PanelGroup>
      )
    })

    // Don't display the panels if the project doesn't have any collections
    if (projectIds.length === 0) {
      return null
    }

    return (
      <Panels
        draggable
        show={collectionMetadataLoaded && isOpen}
        activePanel={loaded ? activePanel : ''}
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
  collections: PropTypes.shape({}).isRequired,
  dataQualitySummaries: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  panels: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired
}

export default ProjectPanels
