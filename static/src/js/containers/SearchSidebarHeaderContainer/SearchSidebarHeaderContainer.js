import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'

import actions from '../../actions/index'
import { locationPropType } from '../../util/propTypes/location'

export const mapDispatchToProps = (dispatch) => ({
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId))
})

export const SearchSidebarHeaderContainer = ({ location, onFocusedCollectionChange }) => (
  <SearchSidebarHeader
    location={location}
    onFocusedCollectionChange={onFocusedCollectionChange}
  />
)
SearchSidebarHeaderContainer.propTypes = {
  location: locationPropType.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(SearchSidebarHeaderContainer)
)
