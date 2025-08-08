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
  panels: state.panels,
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
    (value) => dispatch(actions.togglePanels(value))
})

/**
 * Renders ProjectPanelsContainer.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} panels - The current panels state.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} onSetActivePanel - Switches the currently active panel.
 * @param {Function} onSetActivePanelGroup - Callback to set the active panel group.
 * @param {Function} onSetActivePanelGroup - Callback to set the page number.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 * @param {Function} onTogglePanels - Toggles the panels opened or closed.
 */
export const ProjectPanelsContainer = ({
  focusedGranuleId,
  granulesMetadata,
  location,
  onChangePath,
  onFocusedGranuleChange,
  onSetActivePanel,
  onSetActivePanelGroup,
  onToggleAboutCSDAModal,
  onTogglePanels,
  panels,
  ursProfile
}) => {
  const {
    addGranuleToProjectCollection,
    dataQualitySummaries,
    projectCollections,
    removeGranuleFromProjectCollection,
    selectAccessMethod,
    setFocusedCollection,
    updateAccessMethod
  } = useEdscStore((state) => ({
    addGranuleToProjectCollection: state.project.addGranuleToProjectCollection,
    dataQualitySummaries: state.dataQualitySummaries.byCollectionId,
    projectCollections: state.project.collections,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    selectAccessMethod: state.project.selectAccessMethod,
    setFocusedCollection: state.focusedCollection.setFocusedCollection,
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
      onSetActivePanel={onSetActivePanel}
      onSetActivePanelGroup={onSetActivePanelGroup}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onTogglePanels={onTogglePanels}
      onUpdateAccessMethod={updateAccessMethod}
      setFocusedCollection={setFocusedCollection}
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

ProjectPanelsContainer.propTypes = {
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelGroup: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
