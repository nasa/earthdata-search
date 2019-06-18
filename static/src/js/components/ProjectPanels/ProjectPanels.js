import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import ProjectPanelSection from './ProjectPanelSection'
import AccessMethod from './AccessMethod'
import CollectionDetails from './CollectionDetails'

import './ProjectPanels.scss'

/**
 * Renders ProjectPanels.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - The current collections from the state.
 * @param {object} props.projectPanels - The current projectPanels state.
 * @param {function} props.onTogglePanels - Toggles the panels opened or closed.
 * @param {function} props.onSetActivePanel - Switches the currently active panel.
 */
export const ProjectPanels = pure(({
  collections,
  projectPanels,
  onTogglePanels,
  onSetActivePanel
}) => {
  const {
    byId,
    projectIds
  } = collections

  const { activePanel, isOpen } = projectPanels
  const panelSectionEditOptions = []
  const panelSectionCollectionDetails = []

  let loaded = false

  if (projectIds[0] && !Object.keys(byId[projectIds[0]].metadata).length) return null

  const onPanelClose = () => {
    onTogglePanels(false)
  }

  const onChangePanel = (panelId) => {
    onSetActivePanel(panelId)
  }

  projectIds.forEach((collectionId, index) => {
    loaded = true
    const collection = byId[collectionId]
    const { metadata } = collection
    const { dataset_id: title, id, granule_count: granuleCount } = metadata

    const editOptionsFooter = (
      <div className="project-panels__footer">
        <span className="project-panels__collection-status">
          <i className="fa fa-check-circle" />
        </span>
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

    const customFooter = (
      <div>
        This is a custom footer element that overrides the parent
      </div>
    )

    panelSectionEditOptions.push(
      <PanelGroup
        key={`${id}_edit-options`}
        primaryHeading={title}
        secondaryHeading="Edit Options"
        footer={editOptionsFooter}
      >
        <PanelItem>
          <AccessMethod
            index={index}
            metadata={metadata}
            onSetActivePanel={onSetActivePanel}
          />
        </PanelItem>
        <PanelItem hideFooter>
          <ProjectPanelSection>
            Some other panel edit-options. This panel item is using the hideFooter
            prop to hide its footer.
            <br />
            <button
              type="button"
              onClick={() => onSetActivePanel(`0.${index}.0`)}
            >
              Go back
            </button>
            <button
              type="button"
              onClick={() => onSetActivePanel(`0.${index}.2`)}
            >
              See another panel item example
            </button>
            <br />
            Panels are controlled using the onSetActivePanel action. The parameters are
            dot separated indexes of the panel you would like to trigger.
            They should be passed like so:
            <br />
            {'{Panel Section ID}.{Panel Group ID}.{Panel Item ID}'}
          </ProjectPanelSection>
        </PanelItem>
        <PanelItem footer={customFooter}>
          <ProjectPanelSection>
            This one is using a custom footer element.
            <br />
            <button
              type="button"
              onClick={() => onSetActivePanel(`0.${index}.1`)}
            >
              Go back
            </button>
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
      onPanelClose={onPanelClose}
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
})

ProjectPanels.propTypes = {
  projectPanels: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired
}

export default ProjectPanels
