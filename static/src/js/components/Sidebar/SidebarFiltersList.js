import React from 'react'
import PropTypes from 'prop-types'

import './SidebarFiltersList.scss'

/**
 * Renders SidebarFiltersList.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.children - The granule filter items.
 */
export const SidebarFiltersList = ({
  children
}) => (
  <ul className="sidebar-filters-list">
    {children}
  </ul>
)

SidebarFiltersList.propTypes = {
  children: PropTypes.node.isRequired
}

export default SidebarFiltersList
