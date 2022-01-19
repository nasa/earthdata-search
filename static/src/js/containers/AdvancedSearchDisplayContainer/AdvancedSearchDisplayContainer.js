import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import AdvancedSearchDisplay from '../../components/AdvancedSearchDisplay/AdvancedSearchDisplay'

export const mapDispatchToProps = (dispatch) => ({
  onUpdateAdvancedSearch:
    (state) => dispatch(actions.updateAdvancedSearch(state)),
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch
})

export const AdvancedSearchDisplayContainer = ({
  advancedSearch,
  onChangeQuery,
  onUpdateAdvancedSearch
}) => (
  <AdvancedSearchDisplay
    advancedSearch={advancedSearch}
    onUpdateAdvancedSearch={onUpdateAdvancedSearch}
    onChangeQuery={onChangeQuery}
  />
)

AdvancedSearchDisplayContainer.defaultProps = {
  advancedSearch: {}
}

AdvancedSearchDisplayContainer.propTypes = {
  advancedSearch: PropTypes.shape({}),
  onUpdateAdvancedSearch: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchDisplayContainer)
