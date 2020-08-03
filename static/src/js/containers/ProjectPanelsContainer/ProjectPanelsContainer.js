import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'
import { getProjectCollectionsMetadata } from '../../selectors/project'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  dataQualitySummaries: state.dataQualitySummaries,
  projectCollectionsMetadata: getProjectCollectionsMetadata(state),
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  granulesMetadata: state.metadata.granules,
  location: state.router.location,
  panels: state.panels,
  portal: state.portal,
  project: state.project,
  shapefileId: state.shapefile.shapefileId,
  spatial: state.query.collection.spatial
})

const mapDispatchToProps = dispatch => ({
  onChangePath:
    path => dispatch(actions.changePath(path)),
  onSelectAccessMethod:
    method => dispatch(actions.selectAccessMethod(method)),
  onTogglePanels:
    value => dispatch(actions.togglePanels(value)),
  onSetActivePanel:
    panelId => dispatch(actions.setActivePanel(panelId)),
  onSetActivePanelGroup:
    panelId => dispatch(actions.setActivePanelGroup(panelId)),
  onUpdateAccessMethod:
    data => dispatch(actions.updateAccessMethod(data)),
  onFetchDataQualitySummaries:
    conceptId => dispatch(actions.fetchDataQualitySummaries(conceptId)),
  onAddGranuleToProjectCollection:
    data => dispatch(actions.addGranuleToProjectCollection(data)),
  onRemoveGranuleFromProjectCollection:
    data => dispatch(actions.removeGranuleFromProjectCollection(data)),
  onUpdateFocusedCollection:
    collectionId => dispatch(actions.updateFocusedCollection(collectionId)),
  onFocusedGranuleChange:
    granuleId => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeProjectGranulePageNum:
    data => dispatch(actions.changeProjectGranulePageNum(data))
})

export const ProjectPanelsContainer = ({
  collections,
  dataQualitySummaries,
  projectCollectionsMetadata,
  focusedCollection,
  focusedGranule,
  granulesMetadata,
  location,
  portal,
  project,
  panels,
  shapefileId,
  spatial,
  onChangeProjectGranulePageNum,
  onChangePath,
  onSelectAccessMethod,
  onTogglePanels,
  onSetActivePanel,
  onSetActivePanelGroup,
  onUpdateAccessMethod,
  onUpdateFocusedCollection,
  onAddGranuleToProjectCollection,
  onRemoveGranuleFromProjectCollection,
  onFocusedGranuleChange
}) => (
  <ProjectPanels
    collections={collections}
    dataQualitySummaries={dataQualitySummaries}
    projectCollectionsMetadata={projectCollectionsMetadata}
    focusedCollection={focusedCollection}
    focusedGranule={focusedGranule}
    granulesMetadata={granulesMetadata}
    location={location}
    onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
    onChangeProjectGranulePageNum={onChangeProjectGranulePageNum}
    onChangePath={onChangePath}
    onFocusedGranuleChange={onFocusedGranuleChange}
    onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
    onSelectAccessMethod={onSelectAccessMethod}
    onSetActivePanel={onSetActivePanel}
    onSetActivePanelGroup={onSetActivePanelGroup}
    onTogglePanels={onTogglePanels}
    onUpdateAccessMethod={onUpdateAccessMethod}
    onUpdateFocusedCollection={onUpdateFocusedCollection}
    panels={panels}
    portal={portal}
    project={project}
    shapefileId={shapefileId}
    spatial={spatial}
  />
)

ProjectPanelsContainer.defaultProps = {
  shapefileId: null
}

ProjectPanelsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  dataQualitySummaries: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onChangeProjectGranulePageNum: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
