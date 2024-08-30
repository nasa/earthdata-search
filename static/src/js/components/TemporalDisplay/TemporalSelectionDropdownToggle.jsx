import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
// TODO they were using bootstrap calander on the mockup
import { FaCalendarAlt } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

const TemporalSelectionDropdownToggle = ({ onToggleClick }) => (
  <Dropdown.Toggle
    variant="inline-block"
    id="temporal-selection-dropdown"
    aria-label="Open temporal filters"
    className="search-form__button search-form__button--dark"
    onClick={onToggleClick}
  >
    <EDSCIcon className="button__icon" icon={FaCalendarAlt} size="0.825rem" />
  </Dropdown.Toggle>
)

TemporalSelectionDropdownToggle.propTypes = {
  onToggleClick: PropTypes.func.isRequired
}

export default TemporalSelectionDropdownToggle
