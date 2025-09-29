import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SimpleBar from 'simplebar-react'

import useEdscStore from '../../zustand/useEdscStore'

import './Sidebar.scss'

const Sidebar = ({
  children,
  panels = null,
  visible,
  headerChildren = null
}) => {
  const setSidebarWidth = useEdscStore((state) => state.ui.panels.setSidebarWidth)
  const className = classNames({
    sidebar: true,
    'sidebar--hidden': !visible
  })

  const observedElementRef = useRef(null)

  useEffect(() => {
    // Use ResizeObserver to detect changes in the size of the observedElementRef (the sidebar)
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { target } = entry
        setSidebarWidth(target.getBoundingClientRect().width)
      })
    })

    observer.observe(observedElementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // TODO: We should not need to use a style attribute to define the width of the sidebar
  // but we are currently seeing an sporadic issue in playwright due to lazy loading the
  // css and the sidebar being a flex child.
  return (
    <section ref={observedElementRef} className={className} style={{ width: '20.5rem' }}>
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

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  panels: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  headerChildren: PropTypes.node
}

export default Sidebar
