import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getUrsProfile } from '../../selectors/contactInfo'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getCollectionId } from '../../zustand/selectors/collection'
import { getProjectCollectionsMetadata } from '../../zustand/selectors/project'

export const mapStateToProps = (state) => ({
  granulesMetadata: state.metadata.granules,
  location: state.router.location,
  ursProfile: getUrsProfile(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state))
})

/**
 * Renders ProjectPanelsContainer.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} shapefileId - The shapefileId from the store.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onToggleAboutCSDAModal - Toggles the CSDA modal.
 */
export const ProjectPanelsContainer = ({
  granulesMetadata,
  location,
  onChangePath,
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
    setCollectionId,
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
    setCollectionId: state.collection.setCollectionId,
    setPanelGroup: state.projectPanels.setPanelGroup,
    togglePanels: state.projectPanels.setIsOpen,
    updateAccessMethod: state.project.updateAccessMethod
  }))
  const collectionId = useEdscStore(getCollectionId)
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
      collectionId={collectionId}
      granulesMetadata={granulesMetadata}
      granulesQueries={granulesQueries}
      location={location}
      onAddGranuleToProjectCollection={addGranuleToProjectCollection}
      onChangePath={onChangePath}
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
      setCollectionId={setCollectionId}
      spatial={spatial}
      temporal={temporal}
      ursProfile={ursProfile}
      overrideTemporal={overrideTemporal}
    />
  )
}

ProjectPanelsContainer.propTypes = {
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
