import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import AdvancedSearchDisplay from '../../components/AdvancedSearchDisplay/AdvancedSearchDisplay'

export const mapDispatchToProps = (dispatch) => ({
  onUpdateAdvancedSearch:
    (state) => dispatch(actions.updateAdvancedSearch(state))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch
})

export const AdvancedSearchDisplayContainer = ({
  advancedSearch,
  onUpdateAdvancedSearch
}) => (
  <AdvancedSearchDisplay
    advancedSearch={advancedSearch}
    onUpdateAdvancedSearch={onUpdateAdvancedSearch}
  />
)

AdvancedSearchDisplayContainer.defaultProps = {
  advancedSearch: {}
}

AdvancedSearchDisplayContainer.propTypes = {
  advancedSearch: PropTypes.shape({}),
  onUpdateAdvancedSearch: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchDisplayContainer)
