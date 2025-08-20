import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { getCollectionSubscriptions } from '../../selectors/subscriptions'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions/index'

import useEdscStore from '../../zustand/useEdscStore'
import {
  getCollectionsQuery,
  getFocusedCollectionGranuleQuery
} from '../../zustand/selectors/query'
import { getCollections } from '../../zustand/selectors/collections'
import { getFocusedCollectionMetadata } from '../../zustand/selectors/collection'
import { getFocusedGranule } from '../../zustand/selectors/granule'
import { getGranules } from '../../zustand/selectors/granules'
import { getPreferences } from '../../zustand/selectors/preferences'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  collectionSubscriptions: getCollectionSubscriptions(state),
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
 * @param {Object} props.location - Browser location state
 * @param {Function} props.onMetricsCollectionSortChange - Callback for collection sort metrics
 * @param {Function} props.onToggleAboutCwicModal - Callback to toggle the CWIC modal
 * @param {Object} props.match - Router match state
 */
export const SearchPanelsContainer = ({
  authToken,
  collectionSubscriptions,
  isExportRunning,
  location,
  onChangePath,
  onMetricsCollectionSortChange,
  onToggleAboutCSDAModal,
  onToggleAboutCwicModal,
  onExport,
  match
}) => {
  const collections = useEdscStore(getCollections)
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const granules = useEdscStore(getGranules)
  const granuleMetadata = useEdscStore(getFocusedGranule)
  const preferences = useEdscStore(getPreferences)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const {
    setCollectionId,
    changeQuery,
    changeGranuleQuery
  } = useEdscStore((state) => ({
    setCollectionId: state.collection.setCollectionId,
    changeQuery: state.query.changeQuery,
    changeGranuleQuery: state.query.changeGranuleQuery
  }))

  return (
    <SearchPanels
      authToken={authToken}
      collectionMetadata={collectionMetadata}
      collectionQuery={collectionQuery}
      collections={collections}
      collectionSubscriptions={collectionSubscriptions}
      granuleMetadata={granuleMetadata}
      granuleQuery={granuleQuery}
      granules={granules}
      isExportRunning={isExportRunning}
      location={location}
      match={match}
      onApplyGranuleFilters={changeGranuleQuery}
      onChangePath={onChangePath}
      onChangeQuery={changeQuery}
      onExport={onExport}
      onMetricsCollectionSortChange={onMetricsCollectionSortChange}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      onToggleAboutCwicModal={onToggleAboutCwicModal}
      preferences={preferences}
      setCollectionId={setCollectionId}
    />
  )
}

SearchPanelsContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
