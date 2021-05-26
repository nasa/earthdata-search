import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaCalendarAlt } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

const TemporalSelectionDropdownToggle = ({ onToggleClick }) => (
  <Dropdown.Toggle
    variant="inline-block"
    id="temporal-selection-dropdown"
    className="temporal-selection-dropdown__button earch-form__button search-form__button--dark"
    onClick={onToggleClick}
  >
    <EDSCIcon icon={FaCalendarAlt} size="0.825rem" />
  </Dropdown.Toggle>
)

TemporalSelectionDropdownToggle.propTypes = {
  onToggleClick: PropTypes.func.isRequired
}

export default TemporalSelectionDropdownToggle
