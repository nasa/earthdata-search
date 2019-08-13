import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import './GranuleFiltersActions.scss'

export const GranuleFiltersActions = ({
  isValid,
  onApplyClick,
  onClearClick
}) => (
  <div className="granule-filters-actions">
    <Button
      className="granule-filters-actions__action"
      type="submit"
      label="Apply Filters"
      bootstrapVariant="primary"
      onClick={e => onApplyClick(e)}
      disabled={!isValid}
    >
      Apply
    </Button>
    <Button
      className="granule-filters-actions__action"
      label="Clear Filters"
      bootstrapVariant="secondary"
      onClick={e => onClearClick(e)}
    >
      Clear
    </Button>
  </div>
)

GranuleFiltersActions.propTypes = {
  isValid: PropTypes.bool.isRequired,
  onApplyClick: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired
}

export default GranuleFiltersActions
