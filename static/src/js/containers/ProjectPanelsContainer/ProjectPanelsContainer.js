import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getProjectCollectionsMetadata } from '../../selectors/project'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

const mapStateToProps = state => ({
  dataQualitySummaries: state.dataQualitySummaries,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granulesMetadata: state.metadata.granules,
  location: state.router.location,
  panels: state.panels,
  portal: state.portal,
  project: state.project,
  projectCollectionsMetadata: getProjectCollectionsMetadata(state),
  shapefileId: state.shapefile.shapefileId,
  spatial: state.query.collection.spatial,
  temporal: state.query.collection.temporal,
  overrideTemporal: state.query.collection.overrideTemporal
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
    data => dispatch(actions.changeProjectGranulePageNum(data)),
  onViewCollectionGranules:
    collectionId => dispatch(actions.viewCollectionGranules(collectionId))
})

export const ProjectPanelsContainer = ({
  dataQualitySummaries,
  focusedCollectionId,
  focusedGranuleId,
  granulesMetadata,
  location,
  onAddGranuleToProjectCollection,
  onChangePath,
  onChangeProjectGranulePageNum,
  onFocusedGranuleChange,
  onRemoveGranuleFromProjectCollection,
  onSelectAccessMethod,
  onSetActivePanel,
  onSetActivePanelGroup,
  onTogglePanels,
  onUpdateAccessMethod,
  onUpdateFocusedCollection,
  onViewCollectionGranules,
  panels,
  portal,
  project,
  projectCollectionsMetadata,
  shapefileId,
  spatial,
  temporal,
  overrideTemporal
}) => (
  <ProjectPanels
    dataQualitySummaries={dataQualitySummaries}
    focusedCollectionId={focusedCollectionId}
    focusedGranuleId={focusedGranuleId}
    granulesMetadata={granulesMetadata}
    location={location}
    onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
    onChangePath={onChangePath}
    onChangeProjectGranulePageNum={onChangeProjectGranulePageNum}
    onFocusedGranuleChange={onFocusedGranuleChange}
    onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
    onSelectAccessMethod={onSelectAccessMethod}
    onSetActivePanel={onSetActivePanel}
    onSetActivePanelGroup={onSetActivePanelGroup}
    onTogglePanels={onTogglePanels}
    onUpdateAccessMethod={onUpdateAccessMethod}
    onUpdateFocusedCollection={onUpdateFocusedCollection}
    onViewCollectionGranules={onViewCollectionGranules}
    panels={panels}
    portal={portal}
    project={project}
    projectCollectionsMetadata={projectCollectionsMetadata}
    shapefileId={shapefileId}
    spatial={spatial}
    temporal={temporal}
    overrideTemporal={overrideTemporal}
  />
)

ProjectPanelsContainer.defaultProps = {
  shapefileId: null,
  temporal: {},
  overrideTemporal: {}
}

ProjectPanelsContainer.propTypes = {
  dataQualitySummaries: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
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
  spatial: PropTypes.shape({}).isRequired,
  temporal: PropTypes.shape({}),
  overrideTemporal: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
