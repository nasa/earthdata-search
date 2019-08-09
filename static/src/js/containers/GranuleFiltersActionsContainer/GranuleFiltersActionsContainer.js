import React from 'react'
import PropTypes from 'prop-types'


import GranuleFiltersActions from '../../components/GranuleFilters/GranuleFiltersActions'

export const GranuleFiltersActionsContainer = ({
  onApplyClick,
  onClearClick
}) => (
  <GranuleFiltersActions
    onApplyClick={onApplyClick}
    onClearClick={onClearClick}
  />
)

GranuleFiltersActionsContainer.propTypes = {
  onApplyClick: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired
}

export default GranuleFiltersActionsContainer
