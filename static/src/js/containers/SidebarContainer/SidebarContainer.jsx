import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import { isPath } from '../../util/isPath'

import Sidebar from '../../components/Sidebar/Sidebar'
import { routes } from '../../constants/routes'

export const SidebarContainer = ({
  children,
  panels = null,
  headerChildren = null
}) => {
  const location = useLocation()
  const { pathname } = location

  const sidebarVisible = isPath(pathname, [
    routes.SEARCH,
    routes.GRANULES,
    routes.COLLECTION_SUBSCRIPTIONS,
    routes.PROJECT,
    routes.COLLECTION_DETAILS,
    routes.GRANULE_DETAILS,
    routes.GRANULE_SUBSCRIPTIONS
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
