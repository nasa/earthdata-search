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

  // TODO: We should not need to use a style attribute to define the width of the sidebar
  // but we are currently seeing an sporadic issue in playwright due to lazy loading the
  // css and the sidebar being a flex child.
  return (
    <section className={className} style={{ width: '20.5rem' }}>
      <div className="sidebar__inner">
        { headerChildren }
        <SimpleBar
          className="sidebar__content"
          style={
            {
              height: '100%'
            }
          }
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
