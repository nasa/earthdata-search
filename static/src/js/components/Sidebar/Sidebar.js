import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SimpleBar from 'simplebar-react'

import Header from './SidebarHeader'

import './Sidebar.scss'

const Sidebar = ({
  children,
  edscEnv,
  panels,
  portal,
  visible
}) => {
  const className = classNames({
    sidebar: true,
    'sidebar--hidden': !visible
  })

  return (
    <section className={className}>
      <div className="sidebar__inner">
        <Header
          edscEnv={edscEnv}
          portal={portal}
        />
        <SimpleBar className="sidebar__content" style={{ height: '100%', overflowX: 'hidden' }}>
          {children}
        </SimpleBar>
      </div>
      {panels && panels}
    </section>
  )
}

Sidebar.defaultProps = {
  panels: null
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  edscEnv: PropTypes.string.isRequired,
  panels: PropTypes.node,
  portal: PropTypes.shape({}).isRequired,
  visible: PropTypes.bool.isRequired
}

export default Sidebar
