import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TemporalSelectionDropdown from '../../components/TemporalDisplay/TemporalSelectionDropdown'

import { metricsTemporalFilter } from '../../middleware/metrics/actions'
import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsTemporalFilter: (data) => dispatch(metricsTemporalFilter(data))
})

/**
 * Component representing the temporal selection dropdown
 * @param {object} temporalSearch - The temporal state from the redux store
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
export const TemporalSelectionDropdownContainer = (props) => {
  const {
    searchParams,
    onMetricsTemporalFilter
  } = props

  const changeQuery = useEdscStore((state) => state.query.changeQuery)

  return (
    <TemporalSelectionDropdown
      searchParams={searchParams}
      onChangeQuery={changeQuery}
      onMetricsTemporalFilter={onMetricsTemporalFilter}
    />
  )
}

TemporalSelectionDropdownContainer.defaultProps = {
  searchParams: {}
}

TemporalSelectionDropdownContainer.propTypes = {
  onMetricsTemporalFilter: PropTypes.func.isRequired,
  searchParams: PropTypes.shape({})
}

export default connect(null, mapDispatchToProps)(TemporalSelectionDropdownContainer)
