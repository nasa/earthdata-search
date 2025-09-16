import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tabs from 'react-bootstrap/Tabs'

import './EDSCTabs.scss'

/**
 * Renders EDSCTabs.
 * @param {Node} children - Must be valid children for the react-bootstrap Tabs component.
 * @param {String} className - An optional classname.
 * @param {Boolean} fill - Fills the tabs to the width of the container.
 * @param {Boolean} padding - Adds/disables padding in the tabs.
 */
export const EDSCTabs = ({
  children,
  className = '',
  fill = false,
  padding = true
}) => {
  const tabsClassNames = classNames([
    'edsc-tabs',
    {
      'edsc-tabs--no-padding': !padding,
      [`${className}`]: className
    }
  ])

  return children.filter(Boolean).length > 0 && (
    <div className={tabsClassNames}>
      <Tabs
        className="edsc-tabs__tabs"
        fill={fill}
      >
        {children}
      </Tabs>
    </div>
  )
}

EDSCTabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fill: PropTypes.bool,
  padding: PropTypes.bool
}

export default EDSCTabs
