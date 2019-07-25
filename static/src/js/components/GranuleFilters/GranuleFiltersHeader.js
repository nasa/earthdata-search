import React from 'react'
// import PropTypes from 'prop-types'

import './GranuleFiltersHeader.scss'

export const GranuleFiltersHeader = () => (
  <div className="granule-filters-header">
    <i className="fa fa-filter" />
    <h2 className="granule-filters-header__primary">Granule Filters</h2>
    <span className="granule-filters-header__secondary">Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050</span>
  </div>
)

// GranuleFiltersHeader.propTypes = {
//   children: PropTypes.node.isRequired
// }

export default GranuleFiltersHeader
