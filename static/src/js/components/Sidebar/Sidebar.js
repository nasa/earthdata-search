import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Header from './SidebarHeader'

import './Sidebar.scss'

const Sidebar = ({ children, visible }) => {
  const className = classNames({
    sidebar: true,
    'sidebar--hidden': !visible
  })

  return (
    <section className={className}>
      <Header />
      <section className="sidebar__content">
        {children}
      </section>
    </section>
  )
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired
}

export default Sidebar
