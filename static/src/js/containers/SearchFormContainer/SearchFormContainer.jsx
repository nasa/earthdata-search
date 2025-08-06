import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'
import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  handleError: (error) => dispatch(actions.handleError(error)),
  onToggleAdvancedSearchModal:
    (state) => dispatch(actions.toggleAdvancedSearchModal(state))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  authToken: state.authToken
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export const SearchFormContainer = (props) => {
  const {
    advancedSearch,
    authToken,
    handleError,
    onToggleAdvancedSearchModal
  } = props
  const clearFilters = useEdscStore((state) => state.query.clearFilters)

  return (
    <SearchForm
      authToken={authToken}
      handleError={handleError}
      onClearFilters={clearFilters}
      onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
      advancedSearch={advancedSearch}
    />
  )
}

SearchFormContainer.defaultProps = {
  advancedSearch: {}
}

SearchFormContainer.propTypes = {
  advancedSearch: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }),
  authToken: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
