import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TemporalSelectionDropdown from '../../components/TemporalDisplay/TemporalSelectionDropdown'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  temporalSearch: state.query.collection.temporal
})

/**
 * Component representing the temporal selection dropdown
 * @param {object} temporalSearch - The temporal state from the redux store
 * @param {function} onChangeQuery - A redux action to update the temporal state
 */
const TemporalSelectionDropdownContainer = (props) => {
  const {
    onChangeQuery,
    temporalSearch
  } = props

  return (
    <TemporalSelectionDropdown
      onChangeQuery={onChangeQuery}
      temporalSearch={temporalSearch}
    />
  )
}

TemporalSelectionDropdownContainer.defaultProps = {
  temporalSearch: {}
}

TemporalSelectionDropdownContainer.propTypes = {
  temporalSearch: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporalSelectionDropdownContainer)
