import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PanelSection.scss'

export const PanelSection = ({
  children,
  isActive = false,
  isOpen = false
}) => {
  const className = classNames([
    'panel-section',
    {
      'panel-section--is-open': isOpen,
      'panel-section--is-active': isActive
    }
  ])

  return (
    <section className={className}>
      {children}
    </section>
  )
}

PanelSection.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  isActive: PropTypes.bool
}

export default PanelSection
