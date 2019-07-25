import React from 'react'
import PropTypes from 'prop-types'

import './GranuleFiltersItem.scss'

export const GranuleFiltersItem = ({
  description,
  heading,
  children
}) => (
  <li className="granule-filters-item">
    <header className="granule-filters-item__header">
      <h3 className="granule-filters-item__heading">{heading}</h3>
      {
        description && (
          <p className="granule-filters-item__description">{description}</p>
        )
      }
    </header>
    <div className="granule-filters-item__body">
      {children}
    </div>
  </li>
)

GranuleFiltersItem.defaultProps = {
  description: null
}

GranuleFiltersItem.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  heading: PropTypes.node.isRequired
}

export default GranuleFiltersItem
