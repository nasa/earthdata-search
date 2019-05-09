import React from 'react'
import PropTypes from 'prop-types'

import './FacetsSectionHeading.scss'

export const FacetsSectionHeading = ({ id, letter }) => (
  <h3
    id={id}
    className="facets-section-heading"
  >
    {letter}
  </h3>
)

FacetsSectionHeading.propTypes = {
  id: PropTypes.string.isRequired,
  letter: PropTypes.string.isRequired
}

export default FacetsSectionHeading
