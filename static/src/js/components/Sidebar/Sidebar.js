import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SimpleBar from 'simplebar-react'

import './Sidebar.scss'

const Sidebar = ({
  children,
  panels,
  visible,
  headerChildren
}) => {
  const className = classNames({
    sidebar: true,
    'sidebar--hidden': !visible
  })

  return (
    <section className={className}>
      <div className="sidebar__inner">
        { headerChildren }
        <SimpleBar
          className="sidebar__content"
          style={{
            height: '100%'
          }}
        >
          {children}
        </SimpleBar>
      </div>
      {panels && panels}
    </section>
  )
}

Sidebar.defaultProps = {
  panels: null,
  headerChildren: null
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  panels: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  headerChildren: PropTypes.node
}

export default Sidebar
