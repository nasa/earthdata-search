import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TemporalSelectionDropdown from '../../components/TemporalDisplay/TemporalSelectionDropdown'

import { metricsTemporalFilter } from '../../middleware/metrics/actions'
import actions from '../../actions'

export const mapDispatchToProps = (dispatch) => ({
  onChangeQuery: (query) => dispatch(actions.changeQuery(query)),
  onMetricsTemporalFilter: (data) => dispatch(metricsTemporalFilter(data))
})

export const mapStateToProps = (state) => ({
  temporalSearch: state.query.collection.temporal
})

/**
 * Component representing the temporal selection dropdown
 * @param {object} temporalSearch - The temporal state from the redux store
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
export const TemporalSelectionDropdownContainer = (props) => {
  const {
    onChangeQuery,
    temporalSearch,
    onMetricsTemporalFilter
  } = props

  return (
    <TemporalSelectionDropdown
      onChangeQuery={onChangeQuery}
      temporalSearch={temporalSearch}
      onMetricsTemporalFilter={onMetricsTemporalFilter}
    />
  )
}

TemporalSelectionDropdownContainer.defaultProps = {
  temporalSearch: {}
}

TemporalSelectionDropdownContainer.propTypes = {
  temporalSearch: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsTemporalFilter: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporalSelectionDropdownContainer)
