import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

export const mapDispatchToProps = (dispatch) => ({
  onSetActivePanel:
    (panelId) => dispatch(actions.setActivePanel(panelId)),
  onTogglePanels:
    (isOpen) => dispatch(actions.togglePanels(isOpen)),
  onSetActivePanelSection:
    (sectionId) => dispatch(actions.setActivePanelSection(sectionId)),
  onUpdateProjectName:
    (name) => dispatch(actions.updateProjectName(name)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const mapStateToProps = (state) => ({
  panels: state.panels,
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    onMetricsDataAccess,
    onSetActivePanel,
    onSetActivePanelSection,
    onTogglePanels,
    onUpdateProjectName,
    panels,
    savedProject
  } = props

  return (
    <ProjectCollections
      onMetricsDataAccess={onMetricsDataAccess}
      onSetActivePanel={onSetActivePanel}
      onSetActivePanelSection={onSetActivePanelSection}
      onTogglePanels={onTogglePanels}
      onUpdateProjectName={onUpdateProjectName}
      panels={panels}
      savedProject={savedProject}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  onMetricsDataAccess: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
