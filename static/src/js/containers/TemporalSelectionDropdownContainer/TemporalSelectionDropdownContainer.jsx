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
    searchParams,
    temporalSearch,
    onMetricsTemporalFilter
  } = props

  return (
    <TemporalSelectionDropdown
      searchParams={searchParams}
      onChangeQuery={onChangeQuery}
      temporalSearch={temporalSearch}
      onMetricsTemporalFilter={onMetricsTemporalFilter}
    />
  )
}

TemporalSelectionDropdownContainer.defaultProps = {
  searchParams: {},
  temporalSearch: {}
}

TemporalSelectionDropdownContainer.propTypes = {
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsTemporalFilter: PropTypes.func.isRequired,
  searchParams: PropTypes.shape({}),
  temporalSearch: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporalSelectionDropdownContainer)
