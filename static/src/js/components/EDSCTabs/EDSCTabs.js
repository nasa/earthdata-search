import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Tabs } from 'react-bootstrap'

import './EDSCTabs.scss'

/**
 * Renders EDSCTabs.
 * @param {Node} children - Must be valid children for the react-bootstrap Tabs component.
 * @param {String} className - An optional classname.
 * @param {Boolean} padding - Adds/disables padding in the tabs.
 */
export const EDSCTabs = ({
  className,
  children,
  padding
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
      <Tabs className="edsc-tabs__tabs">
        {children}
      </Tabs>
    </div>
  )
}

EDSCTabs.defaultProps = {
  className: '',
  padding: true
}

EDSCTabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool
}

export default EDSCTabs
