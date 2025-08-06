import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getUrsProfile } from '../../selectors/contactInfo'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getFocusedCollectionId } from '../../zustand/selectors/focusedCollection'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

export const mapStateToProps = (state) => ({
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
})

/**
 * Renders ProjectPanelsContainer.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 */
export const ProjectPanelsContainer = ({
  focusedGranuleId,
  granulesMetadata,
  location,
  onChangePath,
  onFocusedGranuleChange,
  onToggleAboutCSDAModal,
  ursProfile
}) => {
  const {
    addGranuleToProjectCollection,
    dataQualitySummaries,
    panels: panelsData,
    projectCollections,
    removeGranuleFromProjectCollection,
    selectAccessMethod,
    setActivePanel,
    setFocusedCollection,
    setPanelGroup,
    togglePanels,
    updateAccessMethod
  } = useEdscStore((state) => ({
    addGranuleToProjectCollection: state.project.addGranuleToProjectCollection,
    dataQualitySummaries: state.dataQualitySummaries.byCollectionId,
    panels: state.projectPanels.panels,
    projectCollections: state.project.collections,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    selectAccessMethod: state.project.selectAccessMethod,
    setActivePanel: state.projectPanels.setActivePanel,
    setFocusedCollection: state.focusedCollection.setFocusedCollection,
    setPanelGroup: state.projectPanels.setPanelGroup,
    togglePanels: state.projectPanels.setIsOpen,
    updateAccessMethod: state.project.updateAccessMethod
  }))
  const focusedCollectionId = useEdscStore(getFocusedCollectionId)
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
      panels={panelsData}
      projectCollections={projectCollections}
      projectCollectionsMetadata={projectCollectionsMetadata}
      setFocusedCollection={setFocusedCollection}
      spatial={spatial}
      temporal={temporal}
      ursProfile={ursProfile}
      overrideTemporal={overrideTemporal}
    />
  )
}

ProjectPanelsContainer.propTypes = {
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
