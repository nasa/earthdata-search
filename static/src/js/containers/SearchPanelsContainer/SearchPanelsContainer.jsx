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
  isExportRunning: state.ui.export.isExportRunning
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onMetricsCollectionSortChange:
    (data) => dispatch(metricsCollectionSortChange(data)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state)),
  onToggleAboutCwicModal:
    (state) => dispatch(actions.toggleAboutCwicModal(state)),
  onExport: (format) => dispatch(actions.exportSearch(format))
})

/**
 * SearchPanelsContainer component
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collectionMetadata - Collection metadata state
 * @param {Object} props.collectionsSearch - Collection search state
 * @param {Object} props.granuleMetadata - Granule metadata state
 * @param {Object} props.granuleSearchResults - Granule search results state
 * @param {Object} props.location - Browser location state
 * @param {Function} props.onMetricsCollectionSortChange - Callback for collection sort metrics
 * @param {Function} props.onToggleAboutCwicModal - Callback to toggle the CWIC modal
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
  onChangePath,
  onMetricsCollectionSortChange,
  onToggleAboutCSDAModal,
  onToggleAboutCwicModal,
  onExport,
  match
}) => {
  const preferences = useEdscStore(getPreferences)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const {
    changeFocusedCollection,
    changeQuery,
    changeGranuleQuery
  } = useEdscStore((state) => ({
    changeFocusedCollection: state.focusedCollection.changeFocusedCollection,
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
      changeFocusedCollection={changeFocusedCollection}
      onChangePath={onChangePath}
      onChangeQuery={changeQuery}
      onMetricsCollectionSortChange={onMetricsCollectionSortChange}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onToggleAboutCwicModal={onToggleAboutCwicModal}
      onExport={onExport}
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
  onChangePath: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
)
