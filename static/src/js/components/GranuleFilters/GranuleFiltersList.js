import React from 'react'
import PropTypes from 'prop-types'

import './GranuleFiltersList.scss'

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
