import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'

import actions from '../../actions/index'
import { locationPropType } from '../../util/propTypes/location'

export const mapStateToProps = (state) => ({
  portal: state.portal,
  projectCollectionIds: state.project.collections.allIds
})

export const mapDispatchToProps = (dispatch) => ({
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onChangePath: (path) => dispatch(actions.changePath(path)),
  // TODO adding onload
  onLoadPortalConfig:
  (portalId) => dispatch(actions.loadPortalConfig(portalId))
})

export const SearchSidebarHeaderContainer = ({
  location,
  onFocusedCollectionChange,
  portal,
  onChangePath,
  onLoadPortalConfig
}) => (
  <SearchSidebarHeader
    location={location}
    onFocusedCollectionChange={onFocusedCollectionChange}
    portal={portal}
    onChangePath={onChangePath}
    onLoadPortalConfig={onLoadPortalConfig}
  />
)
SearchSidebarHeaderContainer.propTypes = {
  location: locationPropType.isRequired,
  // TODO we may not need the onFocusedCollectionChange anymore
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onLoadPortalConfig: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchSidebarHeaderContainer)
)
