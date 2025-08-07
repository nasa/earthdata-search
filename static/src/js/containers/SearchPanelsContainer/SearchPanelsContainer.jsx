import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'
import { getCollectionSubscriptions } from '../../selectors/subscriptions'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions/index'

import useEdscStore from '../../zustand/useEdscStore'
import {
  getCollectionsQuery,
  getFocusedCollectionGranuleQuery
} from '../../zustand/selectors/query'
import { getPreferences } from '../../zustand/selectors/preferences'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionsSearch: state.searchResults.collections,
  collectionSubscriptions: getCollectionSubscriptions(state),
  granuleMetadata: getFocusedGranuleMetadata(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  panels: state.panels,
  isExportRunning: state.ui.export.isExportRunning
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onMetricsCollectionSortChange:
    (data) => dispatch(metricsCollectionSortChange(data)),
  onSetActivePanel:
    (panelId) => dispatch(actions.setActivePanel(panelId)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state)),
  onToggleAboutCwicModal:
    (state) => dispatch(actions.toggleAboutCwicModal(state)),
  onTogglePanels:
    (value) => dispatch(actions.togglePanels(value)),
  onExport: (format) => dispatch(actions.exportSearch(format))
})

/**
 * SearchPanelsContainer component
 * @extends PureComponent
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collectionMetadata - Collection metadata state
 * @param {Object} props.collectionsSearch - Collection search state
 * @param {Object} props.granuleMetadata - Granule metadata state
 * @param {Object} props.granuleSearchResults - Granule search results state
 * @param {Object} props.location - Browser location state
 * @param {Function} props.onFocusedCollectionChange - Callback to change the focused collection
 * @param {Function} props.onMetricsCollectionSortChange - Callback for collection sort metrics
 * @param {Function} props.onSetActivePanel - Callback to set the active panel
 * @param {Function} props.onToggleAboutCwicModal - Callback to toggle the CWIC modal
 * @param {Function} props.onTogglePanels - Callback to toggle the panels
 * @param {Object} props.panels - Panels state
 * @param {Object} props.preferences - Preferences state
 * @param {Object} props.match - Router match state
 */
export const SearchPanelsContainer = ({
  authToken,
  collectionMetadata,
  collectionsSearch,
  collectionSubscriptions,
  granuleMetadata,
  granuleSearchResults,
  isExportRunning,
  location,
  onFocusedCollectionChange,
  onChangePath,
  onMetricsCollectionSortChange,
  onSetActivePanel,
  onToggleAboutCSDAModal,
  onToggleAboutCwicModal,
  onTogglePanels,
  onExport,
  panels,
  match
}) => {
  const preferences = useEdscStore(getPreferences)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const {
    changeQuery,
    changeGranuleQuery
  } = useEdscStore((state) => ({
    changeQuery: state.query.changeQuery,
    changeGranuleQuery: state.query.changeGranuleQuery
  }))

  return (
    <SearchPanels
      authToken={authToken}
      collectionMetadata={collectionMetadata}
      collectionQuery={collectionQuery}
      collectionsSearch={collectionsSearch}
      collectionSubscriptions={collectionSubscriptions}
      granuleMetadata={granuleMetadata}
      granuleSearchResults={granuleSearchResults}
      granuleQuery={granuleQuery}
      isExportRunning={isExportRunning}
      location={location}
      onApplyGranuleFilters={changeGranuleQuery}
      onFocusedCollectionChange={onFocusedCollectionChange}
      onChangePath={onChangePath}
      onChangeQuery={changeQuery}
      onMetricsCollectionSortChange={onMetricsCollectionSortChange}
      onSetActivePanel={onSetActivePanel}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onToggleAboutCwicModal={onToggleAboutCwicModal}
      onTogglePanels={onTogglePanels}
      onExport={onExport}
      panels={panels}
      preferences={preferences}
      match={match}
    />
  )
}

SearchPanelsContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  isExportRunning: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
)
