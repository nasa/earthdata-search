import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Dropdown from 'react-bootstrap/Dropdown'

import { getTemporalDateFormat } from '../../../../../sharedUtils/edscDate'

import Button from '../Button/Button'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

import './TemporalSelectionDropdownMenu.scss'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

const TemporalSelectionDropdownMenu = ({
  allowRecurring,
  disabled,
  displayStartDate,
  displayEndDate,
  isHomePage,
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
  temporal
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

  const clearButton = (
    <Button
      className={classes.btnCancel}
      bootstrapVariant="light"
      label="Clear"
      onClick={onClearClick}
    >
      Clear
    </Button>
  )

  const homePageActions = (
    <div className="temporal-selection-dropdown-menu__actions">
      <PortalLinkContainer
        className={classes.btnApply}
        type="button"
        bootstrapVariant="primary"
        label="Apply"
        onClick={onApplyClick}
        disabled={disabled}
        to="/search"
      >
        Apply
      </PortalLinkContainer>
      {clearButton}
    </div>
  )

  const searchPageActions = (
    <div className="temporal-selection-dropdown-menu__actions">
      <Button
        className={classes.btnApply}
        type="button"
        bootstrapVariant="primary"
        label="Apply"
        onClick={onApplyClick}
        disabled={disabled}
      >
        Apply
      </Button>
      {clearButton}
    </div>
  )

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
        displayStartDate={displayStartDate}
        displayEndDate={displayEndDate}
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
        temporal={temporal}
      />
      {isHomePage ? homePageActions : searchPageActions}
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
