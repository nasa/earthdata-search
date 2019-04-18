import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'

const mapDispatchToProps = dispatch => ({
  onChangeNlpSearch: query => dispatch(actions.searchNlp(query)),
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onClearFilters: () => dispatch(actions.clearFilters())
})

const mapStateToProps = state => ({
  keywordSearch: state.query.keyword
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`

export const SearchFormContainer = (props) => {
  const {
    keywordSearch,
    onChangeNlpSearch,
    onChangeQuery,
    onClearFilters
  } = props

  return (
    <SearchForm
      onChangeQuery={onChangeQuery}
      onClearFilters={onClearFilters}
      onChangeNlpSearch={onChangeNlpSearch}
      keywordSearch={keywordSearch}
    />
  )
}

SearchFormContainer.defaultProps = {
  keywordSearch: ''
}

SearchFormContainer.propTypes = {
  keywordSearch: PropTypes.string,
  onChangeNlpSearch: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
