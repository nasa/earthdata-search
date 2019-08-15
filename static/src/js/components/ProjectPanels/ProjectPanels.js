import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import ProjectPanelSection from './ProjectPanelSection'
import AccessMethod from '../AccessMethod/AccessMethod'
import CollectionDetails from './CollectionDetails'
import VariableKeywordPanel from './VariableKeywordPanel'
import VariablesPanel from './VariablesPanel'
import VariableDetailsPanel from './VariableDetailsPanel'

import { isAccessMethodValid } from '../../util/accessMethods'

import './ProjectPanels.scss'

/**
 * Renders ProjectPanels.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - The current collections from the state.
 * @param {object} props.projectPanels - The current projectPanels state.
 * @param {function} props.onTogglePanels - Toggles the panels opened or closed.
 * @param {function} props.onSetActivePanel - Switches the currently active panel.
 */

class ProjectPanels extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedKeyword: null,
      selectedVariable: null,
      selectedVariables: [],
      variables: null
    }

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.selectKeyword = this.selectKeyword.bind(this)
    this.onSaveVariables = this.onSaveVariables.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.clearSelectedKeyword = this.clearSelectedKeyword.bind(this)
    this.clearSelectedVariable = this.clearSelectedVariable.bind(this)
    this.onViewDetails = this.onViewDetails.bind(this)
  }

  onPanelClose() {
    const { onTogglePanels } = this.props
    onTogglePanels(false)
  }

  onChangePanel(panelId) {
    const { onSetActivePanel } = this.props
    onSetActivePanel(panelId)
  }

  onCheckboxChange(variableId, e) {
    const { selectedVariables, variables } = this.state
    let newVariables

    if (variableId === 'all') {
      if (e.target.checked) {
        newVariables = Object.keys(variables)
      } else {
        newVariables = []
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (e.target.checked) {
        newVariables = [
          ...selectedVariables,
          variableId
        ]
      } else {
        newVariables = selectedVariables.filter(variable => variable !== variableId)
      }
    }

    this.setState({
      selectedVariables: newVariables
    })
  }

  onSaveVariables(collectionId, index) {
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
          selectedVariables
        }
      }
    })

    this.onChangePanel(`0.${index}.1`)
  }

  onViewDetails(variable, index) {
    this.setState({ selectedVariable: variable })
    this.onChangePanel(`0.${index}.3`)
  }

  backToOptions(index) {
    this.setState({ selectedKeyword: null, variables: null })
    this.onChangePanel(`0.${index}.0`)
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

  render() {
    const {
      collections,
      project,
      projectPanels,
      shapefileId,
      onSelectAccessMethod,
      onTogglePanels,
      onSetActivePanel,
      onUpdateAccessMethod
    } = this.props

    const {
      selectedKeyword,
      selectedVariable,
      selectedVariables,
      variables
    } = this.state

    const { byId } = collections
    const { collectionIds: projectIds, byId: projectById } = project

    const { activePanel, isOpen } = projectPanels
    const panelSectionEditOptions = []
    const panelSectionCollectionDetails = []

    let loaded = false

    if (projectIds[0] && !Object.keys(byId[projectIds[0]].metadata).length) return null

    projectIds.forEach((collectionId, index) => {
      loaded = true
      const collection = byId[collectionId]
      const projectCollection = projectById[collectionId]
      const { metadata } = collection
      const { dataset_id: title, id, granule_count: granuleCount } = metadata

      const {
        accessMethods,
        selectedAccessMethod
      } = projectCollection
      const isValid = isAccessMethodValid(projectCollection)

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
            index > 0 && (
              <Button
                className="project-panels__action"
                label="Previous Collection"
                bootstrapVariant="light"
                onClick={() => onSetActivePanel(`0.${index - 1}.0`)}
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
                onClick={() => onSetActivePanel(`0.${index + 1}.0`)}
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
                onClick={() => onTogglePanels(false)}
              >
                Done
              </Button>
            )
          }
        </div>
      )

      const variablePanelFooter = (
        <div>
          <Button
            type="button"
            label="Back"
            bootstrapVariant="light"
            className="button secondary master-overlay-panel-item-footer-action"
            onClick={() => this.clearSelectedKeyword(`0.${index}.1`)}
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: clearKeyword"
          >
            Back
          </Button>
          <Button
            type="button"
            label="Save"
            bootstrapVariant="primary"
            className="collection-customization-save master-overlay-panel-item-footer-action"
            onClick={() => this.onSaveVariables(collectionId, index)}
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: saveState"
          >
            Save
          </Button>
        </div>
      )

      const variableDetailsFooter = (
        <div>
          <Button
            type="button"
            label="Back"
            bootstrapVariant="primary"
            className="button master-overlay-panel-item-footer-action"
            onClick={() => this.clearSelectedVariable(`0.${index}.2`)}
            data-bind="visible: selectedKeyword() && !selectedVariable(), click: clearKeyword"
          >
            Back
          </Button>
        </div>
      )

      const panelHeader = (
        <div className="panel-item-section panel-item-section-padded panel-item-section-has-back-button">
          <Button
            className="button button-back master-overlay-panel-back"
            type="button"
            label="Back to Edit Options"
            bootstrapVariant="link"
            onClick={() => this.backToOptions(index)}
          >
            <i className="fa fa-chevron-left" />
            Back to Edit Options
          </Button>
          <h3 className="panel-item-section-title">Variable Selection</h3>
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
          <PanelItem>
            <AccessMethod
              accessMethods={accessMethods}
              index={index}
              metadata={metadata}
              shapefileId={shapefileId}
              onSelectAccessMethod={onSelectAccessMethod}
              onSetActivePanel={onSetActivePanel}
              onUpdateAccessMethod={onUpdateAccessMethod}
              selectedAccessMethod={selectedAccessMethod}
            />
          </PanelItem>
          <PanelItem hideFooter>
            <ProjectPanelSection>
              <VariableKeywordPanel
                accessMethods={accessMethods}
                index={index}
                panelHeader={panelHeader}
                selectedAccessMethod={selectedAccessMethod}
                onSelectKeyword={this.selectKeyword}
              />
            </ProjectPanelSection>
          </PanelItem>
          <PanelItem footer={variablePanelFooter}>
            <ProjectPanelSection>
              <VariablesPanel
                index={index}
                panelHeader={panelHeader}
                selectedKeyword={selectedKeyword}
                selectedVariables={selectedVariables}
                variables={variables}
                onCheckboxChange={this.onCheckboxChange}
                onClearSelectedKeyword={this.clearSelectedKeyword}
                onViewDetails={this.onViewDetails}
              />
            </ProjectPanelSection>
          </PanelItem>
          <PanelItem footer={variableDetailsFooter}>
            <ProjectPanelSection>
              <VariableDetailsPanel
                panelHeader={panelHeader}
                variable={selectedVariable}
              />
            </ProjectPanelSection>
          </PanelItem>
        </PanelGroup>
      )

      panelSectionCollectionDetails.push(
        <PanelGroup
          key={`${id}_collection-details`}
          primaryHeading={title}
          secondaryHeading="Details"
        >
          <PanelItem>
            <CollectionDetails granuleCount={granuleCount} />
          </PanelItem>
        </PanelGroup>
      )
    })

    return (
      <Panels
        show={loaded && isOpen}
        activePanel={activePanel}
        onPanelClose={this.onPanelClose}
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
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired
}

export default ProjectPanels
