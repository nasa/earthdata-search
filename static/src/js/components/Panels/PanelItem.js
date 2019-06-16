import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PanelItem.scss'

export const PanelItem = ({ children, isActive }) => {
  const className = classNames([
    'panel-item',
    {
      'panel-item--is-active': isActive
    }
  ])
  return (
    <div className={className}>
      {children}
    </div>
  )
}

PanelItem.defaultProps = {
  isActive: false
}

PanelItem.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool
}

export default PanelItem
