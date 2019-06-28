import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { isPath } from '../../util/isPath'

import Sidebar from '../../components/Sidebar/Sidebar'

const SidebarContainer = ({ children, location, panels }) => {
  const sidebarVisible = isPath(location.pathname, ['/search', '/projects'])

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
