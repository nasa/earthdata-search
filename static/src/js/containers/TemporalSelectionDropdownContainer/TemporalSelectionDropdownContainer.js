import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TemporalSelectionDropdown from '../../components/TemporalDisplay/TemporalSelectionDropdown'

import actions from '../../actions'

const mapDispathToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  temporalSearch: state.query.temporal
})

/**
 * Component representing the temporal selection dropdown
 * @extends Component
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
  temporalSearch: ''
}

TemporalSelectionDropdownContainer.propTypes = {
  temporalSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispathToProps)(TemporalSelectionDropdownContainer)
