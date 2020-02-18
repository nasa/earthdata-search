import PropTypes from 'prop-types'
import React from 'react'

import './SidebarSection.scss'

const SidebarSection = (props) => {
  const {
    children,
    sectionTitle
  } = props

  return (
    <section className="sidebar-section">
      <header className="sidebar-section__header">
        <h2 className="sidebar-section__title">{sectionTitle}</h2>
      </header>
      {children}
    </section>
  )
}

SidebarSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default SidebarSection
