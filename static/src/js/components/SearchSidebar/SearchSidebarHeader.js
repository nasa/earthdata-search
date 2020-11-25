import React from 'react'

import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader.
 */
export const SearchSidebarHeader = () => (
  <div className="search-sidebar-header">
    <SearchFormContainer />
  </div>
)

export default SearchSidebarHeader
