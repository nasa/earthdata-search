import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

export const SearchSidebarHeaderContainer = ({ location, onFocusedCollectionChange }) => (
  <SearchSidebarHeader
    location={location}
    onFocusedCollectionChange={onFocusedCollectionChange}
  />
)
SearchSidebarHeaderContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(SearchSidebarHeaderContainer)
)
