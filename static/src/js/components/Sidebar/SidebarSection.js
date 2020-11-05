import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

import './SidebarSection.scss'

const SidebarSection = (props) => {
  const {
    children,
    sectionTitle,
    padded
  } = props

  const classes = classNames([
    'sidebar-section',
    {
      'sidebar-section--padded': padded
    }
  ])

  return (
    <section className={classes}>
      {
        sectionTitle && (
          <header className="sidebar-section__header">
            <h2 className="sidebar-section__title">{sectionTitle}</h2>
          </header>
        )
      }
      {children}
    </section>
  )
}

SidebarSection.defaultProps = {
  sectionTitle: null,
  padded: false
}

SidebarSection.propTypes = {
  sectionTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  padded: PropTypes.bool
}

export default SidebarSection
