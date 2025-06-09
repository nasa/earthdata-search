import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import actions from '../../actions/index'

import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getProjectCollectionsMetadata } from '../../selectors/project'
import { getUrsProfile } from '../../selectors/contactInfo'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

export const mapStateToProps = (state) => ({
  dataQualitySummaries: state.dataQualitySummaries,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granulesMetadata: state.metadata.granules,
  granulesQueries: state.query.collection.byId,
  overrideTemporal: state.query.collection.overrideTemporal,
  panels: state.panels,
  project: state.project,
  projectCollectionsMetadata: getProjectCollectionsMetadata(state),
  spatial: state.query.collection.spatial,
  temporal: state.query.collection.temporal,
  ursProfile: getUrsProfile(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onAddGranuleToProjectCollection:
    (data) => dispatch(actions.addGranuleToProjectCollection(data)),
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeProjectGranulePageNum:
    (data) => dispatch(actions.changeProjectGranulePageNum(data)),
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
 * @param {Object} panels - The current panels state.
 * @param {Object} project - The project from the store.
 * @param {Object} spatial - The spatial from the store.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Object} projectCollection - The project collection.
 * @param {Function} onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onRemoveGranuleFromProjectCollection - Callback to remove a granule from the project.
 * @param {Function} onSelectAccessMethod - Selects an access method.
 * @param {Function} onSetActivePanel - Switches the currently active panel.
 * @param {Function} onSetActivePanelGroup - Callback to set the active panel group.
 * @param {Function} onSetActivePanelGroup - Callback to set the page number.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 * @param {Function} onTogglePanels - Toggles the panels opened or closed.
 * @param {Function} onUpdateAccessMethod - Callback to update the access method.
 * @param {Function} onUpdateFocusedCollection - Callback to update the focused collection.
 * @param {Function} onViewCollectionGranules - Views the collection granules.
 */
export const ProjectPanelsContainer = ({
  dataQualitySummaries,
  focusedCollectionId,
  focusedGranuleId,
  granulesMetadata,
  granulesQueries,
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
  project,
  projectCollectionsMetadata,
  spatial,
  temporal,
  ursProfile,
  overrideTemporal
}) => {
  const location = useLocation()

  return (
    <ProjectPanels
      dataQualitySummaries={dataQualitySummaries}
      focusedCollectionId={focusedCollectionId}
      focusedGranuleId={focusedGranuleId}
      granulesMetadata={granulesMetadata}
      granulesQueries={granulesQueries}
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
      project={project}
      projectCollectionsMetadata={projectCollectionsMetadata}
      spatial={spatial}
      temporal={temporal}
      ursProfile={ursProfile}
      overrideTemporal={overrideTemporal}
    />
  )
}

ProjectPanelsContainer.defaultProps = {
  granulesQueries: {},
  temporal: {},
  overrideTemporal: {}
}

ProjectPanelsContainer.propTypes = {
  dataQualitySummaries: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  granulesQueries: PropTypes.shape({}),
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
  project: PropTypes.shape({}).isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  spatial: PropTypes.shape({}).isRequired,
  temporal: PropTypes.shape({}),
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired,
  overrideTemporal: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
