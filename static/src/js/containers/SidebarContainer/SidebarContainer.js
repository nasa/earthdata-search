import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { isPath } from '../../util/isPath'

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
    '/projects',
    '/search/granules/collection-details',
    '/search/granules/granule-details'
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
  location: PropTypes.shape({}).isRequired,
  panels: PropTypes.node,
  headerChildren: PropTypes.node
}

export default withRouter(SidebarContainer)
