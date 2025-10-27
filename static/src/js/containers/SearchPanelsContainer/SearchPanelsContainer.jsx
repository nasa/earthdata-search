import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, Routes } from 'react-router-dom'

import { getCollectionSubscriptions } from '../../selectors/subscriptions'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions/index'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapStateToProps = (state) => ({
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
  collectionSubscriptions,
  isExportRunning,
  onChangePath,
  onMetricsCollectionSortChange,
  onToggleAboutCSDAModal,
  onToggleAboutCwicModal,
  onExport
}) => (
  <Routes>
    <Route
      path="/:activePanel1?/:activePanel2?/*"
      element={
        (
          <SearchPanels
            collectionSubscriptions={collectionSubscriptions}
            isExportRunning={isExportRunning}
            onChangePath={onChangePath}
            onExport={onExport}
            onMetricsCollectionSortChange={onMetricsCollectionSortChange}
            onToggleAboutCSDAModal={onToggleAboutCSDAModal}
            onToggleAboutCwicModal={onToggleAboutCwicModal}
          />
        )
      }
    />

  </Routes>
)

SearchPanelsContainer.propTypes = {
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isExportRunning: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
