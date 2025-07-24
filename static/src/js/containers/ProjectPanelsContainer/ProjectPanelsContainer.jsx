import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getUrsProfile } from '../../selectors/contactInfo'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

export const mapStateToProps = (state) => ({
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granulesMetadata: state.metadata.granules,
  granulesQueries: state.query.collection.byId,
  location: state.router.location,
  overrideTemporal: state.query.collection.overrideTemporal,
  panels: state.panels,
  spatial: state.query.collection.spatial,
  temporal: state.query.collection.temporal,
  ursProfile: getUrsProfile(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onFocusedGranuleChange:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onSetActivePanel:
    (panelId) => dispatch(actions.setActivePanel(panelId)),
  onSetActivePanelGroup:
    (panelId) => dispatch(actions.setActivePanelGroup(panelId)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state)),
  onTogglePanels:
    (value) => dispatch(actions.togglePanels(value)),
  onUpdateFocusedCollection:
    (collectionId) => dispatch(actions.updateFocusedCollection(collectionId)),
  onViewCollectionGranules:
    (collectionId) => dispatch(actions.viewCollectionGranules(collectionId))
})

/**
 * Renders ProjectPanelsContainer.
 * @param {String} focusedCollectionId - The focused collection ID.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} panels - The current panels state.
 * @param {Object} spatial - The spatial from the store.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onSetActivePanel - Switches the currently active panel.
 * @param {Function} onSetActivePanelGroup - Callback to set the active panel group.
 * @param {Function} onSetActivePanelGroup - Callback to set the page number.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 * @param {Function} onTogglePanels - Toggles the panels opened or closed.
 * @param {Function} onUpdateFocusedCollection - Callback to update the focused collection.
 * @param {Function} onViewCollectionGranules - Views the collection granules.
 */
export const ProjectPanelsContainer = ({
  focusedCollectionId,
  focusedGranuleId,
  granulesMetadata,
  granulesQueries,
  location,
  onChangePath,
  onFocusedGranuleChange,
  onSetActivePanel,
  onSetActivePanelGroup,
  onToggleAboutCSDAModal,
  onTogglePanels,
  onUpdateFocusedCollection,
  onViewCollectionGranules,
  panels,
  spatial,
  temporal,
  ursProfile,
  overrideTemporal
}) => {
  const {
    addGranuleToProjectCollection,
    dataQualitySummaries,
    projectCollections,
    removeGranuleFromProjectCollection,
    selectAccessMethod,
    updateAccessMethod
  } = useEdscStore((state) => ({
    addGranuleToProjectCollection: state.project.addGranuleToProjectCollection,
    dataQualitySummaries: state.dataQualitySummaries.byCollectionId,
    projectCollections: state.project.collections,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    selectAccessMethod: state.project.selectAccessMethod,
    updateAccessMethod: state.project.updateAccessMethod
  }))
  const projectCollectionsMetadata = useEdscStore(getProjectCollectionsMetadata)

  return (
    <ProjectPanels
      dataQualitySummaries={dataQualitySummaries}
      focusedCollectionId={focusedCollectionId}
      focusedGranuleId={focusedGranuleId}
      granulesMetadata={granulesMetadata}
      granulesQueries={granulesQueries}
      location={location}
      onAddGranuleToProjectCollection={addGranuleToProjectCollection}
      onChangePath={onChangePath}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onRemoveGranuleFromProjectCollection={removeGranuleFromProjectCollection}
      onSelectAccessMethod={selectAccessMethod}
      onSetActivePanel={onSetActivePanel}
      onSetActivePanelGroup={onSetActivePanelGroup}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onTogglePanels={onTogglePanels}
      onUpdateAccessMethod={updateAccessMethod}
      onUpdateFocusedCollection={onUpdateFocusedCollection}
      onViewCollectionGranules={onViewCollectionGranules}
      panels={panels}
      projectCollections={projectCollections}
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
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  granulesQueries: PropTypes.shape({}),
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  spatial: PropTypes.shape({}).isRequired,
  temporal: PropTypes.shape({}),
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired,
  overrideTemporal: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
