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
    (data) => dispatch(metricsDataAccess(data)),
  onUpdateFocusedCollection:
    (collectionId) => dispatch(actions.updateFocusedCollection(collectionId)),
  onViewCollectionDetails:
    (data) => dispatch(actions.viewCollectionDetails(data)),
  onViewCollectionGranules:
    (data) => dispatch(actions.viewCollectionGranules(data))
})

export const mapStateToProps = (state) => ({
  collectionsQuery: state.query.collection,
  panels: state.panels,
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
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
  } = props

  return (
    <ProjectCollections
      collectionsQuery={collectionsQuery}
      onMetricsDataAccess={onMetricsDataAccess}
      onSetActivePanel={onSetActivePanel}
      onSetActivePanelSection={onSetActivePanelSection}
      onTogglePanels={onTogglePanels}
      onUpdateFocusedCollection={onUpdateFocusedCollection}
      onUpdateProjectName={onUpdateProjectName}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      panels={panels}
      savedProject={savedProject}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  collectionsQuery: PropTypes.shape({}).isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
