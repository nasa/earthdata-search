import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Dropdown from 'react-bootstrap/Dropdown'

import { getTemporalDateFormat } from '../../../../../sharedUtils/edscDate'

import Button from '../Button/Button'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

import './TemporalSelectionDropdownMenu.scss'

const TemporalSelectionDropdownMenu = ({
  allowRecurring,
  disabled,
  onApplyClick,
  onClearClick,
  onChangeQuery,
  onChangeRecurring,
  onInvalid,
  onRecurringToggle,
  onSliderChange,
  onValid,
  setEndDate,
  setStartDate,
  temporal,
  displayStartDate,
  displayEndDate
}) => {
  const classes = {
    btnApply: classNames(
      'temporal-selection-dropdown-menu__button',
      'temporal-selection-dropdown-menu__button--apply'
    ),
    btnCancel: classNames(
      'temporal-selection-dropdown-menu__button',
      'temporal-selection-dropdown-menu__button--cancel'
    )
  }

  const { isRecurring } = temporal

  // For recurring dates we don't show the year, it's displayed on the slider
  const temporalDateFormat = getTemporalDateFormat(isRecurring)

  return ReactDOM.createPortal(
    <Dropdown.Menu
      className="temporal-selection-dropdown-menu"
      popperConfig={
        {
          preventOverflow: {
            boundariesElement: 'window'
          }
        }
      }
    >
      <TemporalSelection
        allowRecurring={allowRecurring}
        controlId="temporal-selection-dropdown"
        temporal={temporal}
        format={temporalDateFormat}
        filterType="collection"
        onRecurringToggle={onRecurringToggle}
        onChangeRecurring={onChangeRecurring}
        onChangeQuery={onChangeQuery}
        onSubmitStart={setStartDate}
        onSubmitEnd={setEndDate}
        onSliderChange={onSliderChange}
        onValid={onValid}
        onInvalid={onInvalid}
        displayStartDate={displayStartDate}
        displayEndDate={displayEndDate}
      />
      <div className="temporal-selection-dropdown-menu__actions">
        <Button
          className={classes.btnApply}
          bootstrapVariant="primary"
          label="Apply"
          onClick={onApplyClick}
          disabled={disabled}
        >
          Apply
        </Button>
        <Button
          className={classes.btnCancel}
          bootstrapVariant="light"
          label="Clear"
          onClick={onClearClick}
        >
          Clear
        </Button>
      </div>
    </Dropdown.Menu>,
    document.getElementById('root')
  )
}

TemporalSelectionDropdownMenu.defaultProps = {
  allowRecurring: true,
  filterType: null,
  displayStartDate: '',
  displayEndDate: ''
}

TemporalSelectionDropdownMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  displayEndDate: PropTypes.string,
  displayStartDate: PropTypes.string,
  filterType: PropTypes.string,
  onApplyClick: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeRecurring: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired,
  onInvalid: PropTypes.func.isRequired,
  onRecurringToggle: PropTypes.func.isRequired,
  onSliderChange: PropTypes.func.isRequired,
  onValid: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  setStartDate: PropTypes.func.isRequired
}

export default TemporalSelectionDropdownMenu
