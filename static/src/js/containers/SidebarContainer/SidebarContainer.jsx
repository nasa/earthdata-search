import React from 'react'
import PropTypes from 'prop-types'

import { isPath } from '../../util/isPath'

import Sidebar from '../../components/Sidebar/Sidebar'
import useEdscStore from '../../zustand/useEdscStore'

export const SidebarContainer = ({
  children,
  panels,
  headerChildren
}) => {
  const location = useEdscStore((state) => state.location.location)
  const { pathname } = location

  const sidebarVisible = isPath(pathname, [
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
  panels: PropTypes.node,
  headerChildren: PropTypes.node
}

export default SidebarContainer
