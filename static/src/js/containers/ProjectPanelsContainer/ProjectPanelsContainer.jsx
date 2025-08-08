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
import { getCollectionsQuery } from '../../zustand/selectors/query'

export const mapStateToProps = (state) => ({
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granulesMetadata: state.metadata.granules,
  location: state.router.location,
  ursProfile: getUrsProfile(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onFocusedGranuleChange:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state)),
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
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 * @param {Function} onUpdateFocusedCollection - Callback to update the focused collection.
 * @param {Function} onViewCollectionGranules - Views the collection granules.
 */
export const ProjectPanelsContainer = ({
  focusedCollectionId,
  focusedGranuleId,
  granulesMetadata,
  location,
  onChangePath,
  onFocusedGranuleChange,
  onToggleAboutCSDAModal,
  onUpdateFocusedCollection,
  onViewCollectionGranules,
  ursProfile
}) => {
  const {
    addGranuleToProjectCollection,
    dataQualitySummaries,
    projectCollections,
    removeGranuleFromProjectCollection,
    selectAccessMethod,
    updateAccessMethod,
    panels: panelsData,
    setActivePanel,
    togglePanels,
    setPanelGroup
  } = useEdscStore((state) => ({
    addGranuleToProjectCollection: state.project.addGranuleToProjectCollection,
    dataQualitySummaries: state.dataQualitySummaries.byCollectionId,
    projectCollections: state.project.collections,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    selectAccessMethod: state.project.selectAccessMethod,
    updateAccessMethod: state.project.updateAccessMethod,
    panels: state.projectPanels.panels,
    setActivePanel: state.projectPanels.setActivePanel,
    togglePanels: state.projectPanels.setIsOpen,
    setPanelGroup: state.projectPanels.setPanelGroup
  }))
  const projectCollectionsMetadata = useEdscStore(getProjectCollectionsMetadata)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const {
    byId: granulesQueries,
    overrideTemporal,
    spatial,
    temporal
  } = collectionQuery

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
      onSetActivePanel={setActivePanel}
      onSetActivePanelGroup={setPanelGroup}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onTogglePanels={togglePanels}
      onUpdateAccessMethod={updateAccessMethod}
      onUpdateFocusedCollection={onUpdateFocusedCollection}
      onViewCollectionGranules={onViewCollectionGranules}
      panels={panelsData}
      projectCollections={projectCollections}
      projectCollectionsMetadata={projectCollectionsMetadata}
      spatial={spatial}
      temporal={temporal}
      ursProfile={ursProfile}
      overrideTemporal={overrideTemporal}
    />
  )
}

ProjectPanelsContainer.propTypes = {
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
