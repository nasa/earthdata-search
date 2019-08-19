import React from 'react'
import PropTypes from 'prop-types'

import './GranuleFiltersList.scss'

/**
 * Renders GranuleFiltersList.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.children - The granule filter items.
 */
export const GranuleFiltersList = ({
  children
}) => (
  <ul className="granule-filters-list">
    {children}
  </ul>
)

GranuleFiltersList.propTypes = {
  children: PropTypes.node.isRequired
}

export default GranuleFiltersList
