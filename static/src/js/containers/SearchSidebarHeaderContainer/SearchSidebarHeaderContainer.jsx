import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export const SearchSidebarHeaderContainer = ({
  portal
}) => (
  <SearchSidebarHeader
    portal={portal}
  />
)

SearchSidebarHeaderContainer.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(SearchSidebarHeaderContainer)
