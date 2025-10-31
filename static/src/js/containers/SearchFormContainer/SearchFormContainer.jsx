import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'
import useEdscStore from '../../zustand/useEdscStore'
import { getSelectedRegionQuery } from '../../zustand/selectors/query'

export const mapDispatchToProps = (dispatch) => ({
  onToggleAdvancedSearchModal:
    (state) => dispatch(actions.toggleAdvancedSearchModal(state))
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export const SearchFormContainer = ({
  onToggleAdvancedSearchModal
}) => {
  const clearFilters = useEdscStore((state) => state.query.clearFilters)
  const selectedRegion = useEdscStore(getSelectedRegionQuery)

  return (
    <SearchForm
      onClearFilters={clearFilters}
      onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
      selectedRegion={selectedRegion}
    />
  )
}

SearchFormContainer.propTypes = {
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(null, mapDispatchToProps)(SearchFormContainer)
