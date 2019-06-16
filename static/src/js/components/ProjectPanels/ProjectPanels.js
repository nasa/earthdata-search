import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import ProjectPanelSection from './ProjectPanelSection'
import ProjectPanelAccessMethod from './ProjectPanelAccessMethod'

import './ProjectPanels.scss'

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
    const { dataset_id: title, id } = metadata

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

    panelSectionEditOptions.push(
      <PanelGroup
        key={`${id}_edit-options`}
        primaryHeading={title}
        secondaryHeading="Edit Options"
        footer={editOptionsFooter}
      >
        <PanelItem>
          <ProjectPanelSection>
            <ProjectPanelAccessMethod metadata={metadata} />
          </ProjectPanelSection>
        </PanelItem>
        <PanelItem>
          <ProjectPanelSection>
            Some other panel edit-options
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
          <ProjectPanelSection>
            Some other panel collection-details
          </ProjectPanelSection>
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
