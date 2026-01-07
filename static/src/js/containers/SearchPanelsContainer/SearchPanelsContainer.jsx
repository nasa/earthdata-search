import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

/**
 * SearchPanelsContainer component
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.location - Browser location state
 * @param {Object} props.match - Router match state
 */
export const SearchPanelsContainer = () => (
  <Routes>
    <Route
      path="/:activePanel1?/:activePanel2?/*"
      element={(
        <SearchPanels />
      )}
    />

  </Routes>
)

export default SearchPanelsContainer
