import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionMetadata, getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'
import { getHandoffs } from '../../selectors/handoffs'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions/index'
import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionQuery: state.query.collection,
  collectionsSearch: state.searchResults.collections,
  granuleMetadata: getFocusedGranuleMetadata(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  handoffs: getHandoffs(state),
  mapProjection: state.map.projection,
  panels: state.panels,
  preferences: state.preferences.preferences,
  portal: state.portal,
  subscriptions: getFocusedCollectionSubscriptions(state),
  isExportRunning: state.ui.export.isExportRunning
})

export const mapDispatchToProps = (dispatch) => ({
  onApplyGranuleFilters:
    (values) => dispatch(actions.applyGranuleFilters(values)),
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query)),
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
 * @param {Object} props.collectionQuery - Collection query state
 * @param {Object} props.collectionsSearch - Collection search state
 * @param {Object} props.granuleMetadata - Granule metadata state
 * @param {Object} props.granuleSearchResults - Granule search results state
 * @param {Object} props.granuleQuery - Granule query state
 * @param {Object} props.location - Browser location state
 * @param {String} props.mapProjection - Map projection state
 * @param {Function} props.onApplyGranuleFilters - Callback to apply granule filters
 * @param {Function} props.onChangeQuery - Callback to change the query
 * @param {Function} props.onFocusedCollectionChange - Callback to change the focused collection
 * @param {Function} props.onMetricsCollectionSortChange - Callback for collection sort metrics
 * @param {Function} props.onSetActivePanel - Callback to set the active panel
 * @param {Function} props.onToggleAboutCwicModal - Callback to toggle the CWIC modal
 * @param {Function} props.onTogglePanels - Callback to toggle the panels
 * @param {Object} props.panels - Panels state
 * @param {Object} props.preferences - Preferences state
 * @param {Object} props.match - Router match state
 * @param {Object} props.portal - Portal state
 */
export const SearchPanelsContainer = ({
  authToken,
  collectionMetadata,
  collectionQuery,
  collectionsSearch,
  granuleMetadata,
  granuleSearchResults,
  granuleQuery,
  handoffs,
  isExportRunning,
  location,
  mapProjection,
  onApplyGranuleFilters,
  onFocusedCollectionChange,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onSetActivePanel,
  onToggleAboutCSDAModal,
  onToggleAboutCwicModal,
  onTogglePanels,
  onExport,
  panels,
  preferences,
  match,
  portal
}) => (
  <SearchPanels
    authToken={authToken}
    collectionMetadata={collectionMetadata}
    collectionQuery={collectionQuery}
    collectionsSearch={collectionsSearch}
    granuleMetadata={granuleMetadata}
    granuleSearchResults={granuleSearchResults}
    granuleQuery={granuleQuery}
    handoffs={handoffs}
    isExportRunning={isExportRunning}
    location={location}
    mapProjection={mapProjection}
    onApplyGranuleFilters={onApplyGranuleFilters}
    onFocusedCollectionChange={onFocusedCollectionChange}
    onChangeQuery={onChangeQuery}
    onMetricsCollectionSortChange={onMetricsCollectionSortChange}
    onSetActivePanel={onSetActivePanel}
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
    onToggleAboutCwicModal={onToggleAboutCwicModal}
    onTogglePanels={onTogglePanels}
    onExport={onExport}
    panels={panels}
    preferences={preferences}
    match={match}
    portal={portal}
  />
)

SearchPanelsContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  handoffs: PropTypes.shape({}).isRequired,
  isExportRunning: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  preferences: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
)
