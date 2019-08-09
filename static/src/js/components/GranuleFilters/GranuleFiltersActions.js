import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import './GranuleFiltersActions.scss'

export const GranuleFiltersActions = ({
  onApplyClick,
  onClearClick
}) => (
  <div className="granule-filters-actions">
    <Button
      className="granule-filters-actions__action"
      label="Apply Filters"
      bootstrapVariant="primary"
      onClick={() => onApplyClick()}
    >
      Apply
    </Button>
    <Button
      className="granule-filters-actions__action"
      label="Clear Filters"
      bootstrapVariant="secondary"
      onClick={() => onClearClick()}
    >
      Clear
    </Button>
  </div>
)

GranuleFiltersActions.propTypes = {
  onApplyClick: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired
}

export default GranuleFiltersActions
