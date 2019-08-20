import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { isPath } from '../../util/isPath'

import Sidebar from '../../components/Sidebar/Sidebar'

const mapStateToProps = state => ({
  portal: state.portal
})

export const SidebarContainer = ({
  children,
  location,
  panels,
  portal
}) => {
  const sidebarVisible = isPath(location.pathname, ['/search', '/projects'])

  return (
    <Sidebar
      panels={panels}
      portal={portal}
      visible={sidebarVisible}
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
  panels: PropTypes.node,
  portal: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(SidebarContainer)
)
