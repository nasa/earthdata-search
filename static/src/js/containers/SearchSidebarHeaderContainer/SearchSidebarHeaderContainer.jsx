import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'

import { locationPropType } from '../../util/propTypes/location'

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export const SearchSidebarHeaderContainer = ({
  location,
  portal
}) => (
  <SearchSidebarHeader
    location={location}
    portal={portal}
  />
)
SearchSidebarHeaderContainer.propTypes = {
  location: locationPropType.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(SearchSidebarHeaderContainer)
)
