import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Header from './SidebarHeader'

import './Sidebar.scss'

const Sidebar = ({
  children,
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
          portal={portal}
        />
        <section className="sidebar__content">
          {children}
        </section>
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
  panels: PropTypes.node,
  portal: PropTypes.shape({}).isRequired,
  visible: PropTypes.bool.isRequired
}

export default Sidebar
