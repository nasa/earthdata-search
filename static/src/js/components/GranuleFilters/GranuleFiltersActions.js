import React from 'react'
// import PropTypes from 'prop-types'
import Button from '../Button/Button'

import './GranuleFiltersActions.scss'

export const GranuleFiltersActions = () => (
  <div className="granule-filters-actions">
    <Button
      className="granule-filters-actions__action"
      label="Apply Filters"
      bootstrapVariant="primary"
    >
      Apply
    </Button>
    <Button
      className="granule-filters-actions__action"
      label="Clear Filters"
      bootstrapVariant="secondary"
    >
      Clear
    </Button>
  </div>
)

// GranuleFiltersActions.propTypes = {
//   children: PropTypes.node.isRequired
// }

export default GranuleFiltersActions
