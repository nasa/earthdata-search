import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import { Calendar, ArrowFilledDown } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

const TemporalSelectionDropdownToggle = ({ onToggleClick }) => (
  <Dropdown.Toggle
    variant="light"
    id="temporal-selection-dropdown"
    aria-label="Open temporal filters"
    className="search-form__button search-form__button--secondary gap-1 btn-sm"
    onClick={onToggleClick}
  >
    <EDSCIcon className="button__icon" icon={Calendar} size="0.825rem" />
    Temporal
    <EDSCIcon className="spatial-selection-dropdown__icon button__icon" icon={ArrowFilledDown} size="12" />
  </Dropdown.Toggle>
)

TemporalSelectionDropdownToggle.propTypes = {
  onToggleClick: PropTypes.func.isRequired
}

export default TemporalSelectionDropdownToggle
