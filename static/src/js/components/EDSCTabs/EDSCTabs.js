import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'react-bootstrap'

import './EDSCTabs.scss'

/**
 * Renders EDSCTabs.
 * @param {Node} children - Must be valid children for the react-bootstrap Tabs component.
 * @param {String} className - An optional classname.
 */
export const EDSCTabs = ({
  className,
  children
}) => {
  const classNames = `edsc-tabs${className ? ` ${className}` : ''}`

  return (
    (
      <>
        {
          children.filter(Boolean).length > 0 && (
            <div className={classNames}>
              <Tabs className="edsc-tabs__tabs">
                {children}
              </Tabs>
            </div>
          )
        }
      </>
    )
  )
}

EDSCTabs.defaultProps = {
  className: ''
}

EDSCTabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default EDSCTabs
