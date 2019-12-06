import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeFocusedCollection:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onClearFilters:
    () => dispatch(actions.clearFilters()),
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

const mapStateToProps = state => ({
  keywordSearch: state.query.collection.keyword
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export const SearchFormContainer = (props) => {
  const {
    keywordSearch,
    onChangeQuery,
    onClearFilters,
    onChangeFocusedCollection,
    onToggleAdvancedSearchModal
  } = props

  return (
    <SearchForm
      onChangeQuery={onChangeQuery}
      onChangeFocusedCollection={onChangeFocusedCollection}
      onClearFilters={onClearFilters}
      onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
      keywordSearch={keywordSearch}
    />
  )
}

SearchFormContainer.defaultProps = {
  keywordSearch: ''
}

SearchFormContainer.propTypes = {
  keywordSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
