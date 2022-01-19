import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getProjectCollectionsMetadata } from '../../selectors/project'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

export const mapStateToProps = (state) => ({
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

export const mapDispatchToProps = (dispatch) => ({
  onAddGranuleToProjectCollection:
    (data) => dispatch(actions.addGranuleToProjectCollection(data)),
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeProjectGranulePageNum:
    (data) => dispatch(actions.changeProjectGranulePageNum(data)),
  onFetchDataQualitySummaries:
    (conceptId) => dispatch(actions.fetchDataQualitySummaries(conceptId)),
  onFocusedGranuleChange:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onRemoveGranuleFromProjectCollection:
    (data) => dispatch(actions.removeGranuleFromProjectCollection(data)),
  onSelectAccessMethod:
    (method) => dispatch(actions.selectAccessMethod(method)),
  onSetActivePanel:
    (panelId) => dispatch(actions.setActivePanel(panelId)),
  onSetActivePanelGroup:
    (panelId) => dispatch(actions.setActivePanelGroup(panelId)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state)),
  onTogglePanels:
    (value) => dispatch(actions.togglePanels(value)),
  onUpdateAccessMethod:
    (data) => dispatch(actions.updateAccessMethod(data)),
  onUpdateFocusedCollection:
    (collectionId) => dispatch(actions.updateFocusedCollection(collectionId)),
  onViewCollectionGranules:
    (collectionId) => dispatch(actions.viewCollectionGranules(collectionId))
})

/**
 * Renders ProjectPanelsContainer.
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
  onToggleAboutCSDAModal,
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
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
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
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
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
