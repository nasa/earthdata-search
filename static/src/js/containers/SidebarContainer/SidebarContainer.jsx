import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import { isPath } from '../../util/isPath'

import Sidebar from '../../components/Sidebar/Sidebar'

export const SidebarContainer = ({
  children,
  panels = null,
  headerChildren = null
}) => {
  const location = useLocation()
  const { pathname } = location

  const sidebarVisible = isPath(pathname, [
    '/search',
    '/search/granules',
    '/search/subscriptions',
    '/project',
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

SidebarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  panels: PropTypes.node,
  headerChildren: PropTypes.node
}

export default SidebarContainer
