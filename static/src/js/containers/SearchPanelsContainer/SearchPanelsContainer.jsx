import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, Routes } from 'react-router-dom'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions/index'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onMetricsCollectionSortChange:
    (data) => dispatch(metricsCollectionSortChange(data))
})

/**
 * SearchPanelsContainer component
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.location - Browser location state
 * @param {Function} props.onMetricsCollectionSortChange - Callback for collection sort metrics
 * @param {Object} props.match - Router match state
 */
export const SearchPanelsContainer = ({
  onChangePath,
  onMetricsCollectionSortChange
}) => (
  <Routes>
    <Route
      path="/:activePanel1?/:activePanel2?/*"
      element={
        (
          <SearchPanels
            onChangePath={onChangePath}
            onMetricsCollectionSortChange={onMetricsCollectionSortChange}
          />
        )
      }
    />

  </Routes>
)

SearchPanelsContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SearchPanelsContainer)
