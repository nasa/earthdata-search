import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'

import Sidebar from '../../components/Sidebar/Sidebar'

export const SidebarContainer = ({
  children,
  location,
  panels,
  headerChildren
}) => {
  const sidebarVisible = isPath(location.pathname, [
    '/search',
    '/search/granules',
    '/search/subscriptions',
    '/projects',
    '/search/granules/collection-details',
    '/search/granules/granule-details',
    '/search/granules/subscriptions'
  ])

  return (
    <Sidebar
      panels={panels}
      visible={sidebarVisible}
      headerChildren={headerChildren}
    >
      {children}
    </Sidebar>
  )
}

SidebarContainer.defaultProps = {
  panels: null,
  headerChildren: null
}

SidebarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  location: locationPropType.isRequired,
  panels: PropTypes.node,
  headerChildren: PropTypes.node
}

export default withRouter(SidebarContainer)
