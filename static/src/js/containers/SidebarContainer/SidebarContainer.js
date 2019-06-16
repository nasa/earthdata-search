import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Sidebar from '../../components/Sidebar/Sidebar'

const SidebarContainer = ({ children, location, panels }) => {
  const visible = pathname => pathname === 'search' || pathname === 'projects'
  const sidebarVisible = visible(location.pathname.replace(/\//g, ''))

  return (
    <Sidebar
      location={location}
      visible={sidebarVisible}
      panels={panels}
    >
      {children}
    </Sidebar>
  )
}

SidebarContainer.defaultProps = {
  panels: null
}

SidebarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({}).isRequired,
  panels: PropTypes.node
}

export default withRouter(SidebarContainer)
