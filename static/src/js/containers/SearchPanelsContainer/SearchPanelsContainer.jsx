import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, Routes } from 'react-router-dom'

import actions from '../../actions/index'

import SearchPanels from '../../components/SearchPanels/SearchPanels'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path))
})

/**
 * SearchPanelsContainer component
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.location - Browser location state
 * @param {Object} props.match - Router match state
 */
export const SearchPanelsContainer = ({
  onChangePath
}) => (
  <Routes>
    <Route
      path="/:activePanel1?/:activePanel2?/*"
      element={
        (
          <SearchPanels
            onChangePath={onChangePath}
          />
        )
      }
    />

  </Routes>
)

SearchPanelsContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SearchPanelsContainer)
