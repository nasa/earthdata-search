import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

const TemporalSelectionDropdownToggle = ({ onToggleClick }) => (
  <Dropdown.Toggle
    variant="inline-block"
    id="temporal-selection-dropdown"
    className="search-form__button search-form__button--dark"
    onClick={onToggleClick}
  >
    <EDSCIcon library="fa" icon="FaCalendar" />
  </Dropdown.Toggle>
)

TemporalSelectionDropdownToggle.propTypes = {
  onToggleClick: PropTypes.func.isRequired
}

export default TemporalSelectionDropdownToggle
