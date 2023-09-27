import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Dropdown from 'react-bootstrap/Dropdown'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import TemporalSelectionDropdownMenu from './TemporalSelectionDropdownMenu'
import TemporalSelectionDropdownToggle from './TemporalSelectionDropdownToggle'

import './TemporalSelectionDropdown.scss'

/**
 * TODO:
 * - Find a way to prevent viewing sets of dates that do not have clickable items in the picker
 */

/**
 * Component representing the temporal selection dropdown
 * @extends PureComponent
 */
const TemporalSelectionDropdown = ({ temporalSearch, onChangeQuery }) => {
  const {
    startDate = '',
    endDate = '',
    recurringDayStart = '',
    recurringDayEnd = '',
    isRecurring = false
  } = temporalSearch

  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [temporal, setTemporal] = useState({
    startDate,
    endDate,
    recurringDayStart,
    recurringDayEnd,
    isRecurring
  })

  useEffect(() => {
    setTemporal(temporalSearch)
  }, [temporalSearch])

  /**
   * Toggles state of open
   */
  const onToggleOpen = () => {
    setOpen(!open)
  }

  /**
   * Opens or closes the dropdown depending on the current state
   */
  const onDropdownToggle = () => {
    onToggleOpen()
  }

  /**
   * Opens or closes the dropdown depending on the current state
  */
  const onToggleClick = () => {
    onToggleOpen()
  }

  /**
   * Sets the current start and end dates values in the Redux store
   */
  const onApplyClick = () => {
    const {
      startDate,
      endDate,
      isRecurring
    } = temporal

    const newTemporal = {
      startDate,
      endDate,
      isRecurring
    }

    if (isRecurring) {
      newTemporal.recurringDayStart = moment(startDate).utc().dayOfYear()
      newTemporal.recurringDayEnd = moment(endDate).utc().dayOfYear()
    }

    onChangeQuery({
      collection: {
        temporal: newTemporal
      }
    })

    setOpen(false)
  }

  /**
   * Clears the current temporal values internally and within the Redux store
   */
  const onClearClick = () => {
    setTemporal({
      startDate: '',
      endDate: '',
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    })
    setOpen(false)
    onChangeQuery({
      collection: {
        temporal: {}
      }
    })
  }

  /**
   * Shows or hides the recurring temporal slider depending on the current state
   */
  const onRecurringToggle = (e) => {
    const { target } = e
    const { checked: isChecked } = target

    setTemporal({
      ...temporal,
      isRecurring: isChecked
    })
  }

  /**
   * Shows or hides the recurring temporal slider depending on the current state
   */
  const onChangeRecurring = (value) => {
    try {
      const { startDate, endDate } = temporal
      const newStartDate = moment(startDate || undefined).utc()
      newStartDate.set({
        year: value.min,
        hour: '00',
        minute: '00',
        second: '00'
      })

      const newEndDate = moment(endDate || undefined).utc()
      newEndDate.set({
        year: value.max,
        hour: '23',
        minute: '59',
        second: '59'
      })

      setTemporal({
        ...temporal,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString()
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Disables the submit button
   */
  const onInvalid = () => {
    setDisabled(true)
  }

  /**
   * Disables the submit button
   */
  const onValid = () => {
    setDisabled(false)
  }

  /**
   * Set the startDate prop
   * @param {moment} startDate - The moment object representing the startDate
   */
  const setStartDate = (startDate) => {
    const { isRecurring } = temporal

    if (isRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const startDateObject = moment(temporal.startDate, temporalDateFormatFull)

      startDate.year(startDateObject.year())
    }

    setTemporal({
      ...temporal,
      // eslint-disable-next-line no-underscore-dangle
      startDate: startDate.isValid() ? startDate.toISOString() : startDate._i
    })
  }

  /**
   * Set the endDate prop
   * @param {moment} endDate - The moment object representing the endDate
   */
  const setEndDate = (endDate) => {
    const { isRecurring } = temporal

    if (isRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const endDateObject = moment(temporal.endDate, temporalDateFormatFull)

      endDate.year(endDateObject.year())
    }

    setTemporal({
      ...temporal,
      // eslint-disable-next-line no-underscore-dangle
      endDate: endDate.isValid() ? endDate.toISOString() : endDate._i
    })
  }

  return (
    <Dropdown show={open} className="temporal-selection-dropdown" data-testid="mytestid" onToggle={onDropdownToggle}>
      <TemporalSelectionDropdownToggle onToggleClick={onToggleClick} />
      {
        open && (
          <TemporalSelectionDropdownMenu
            disabled={disabled}
            onApplyClick={onApplyClick}
            onChangeQuery={onChangeQuery}
            onChangeRecurring={onChangeRecurring}
            onClearClick={onClearClick}
            onInvalid={onInvalid}
            onRecurringToggle={onRecurringToggle}
            onValid={onValid}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            temporal={temporal}
          />
        )
      }
    </Dropdown>
  )
}

TemporalSelectionDropdown.defaultProps = {
  temporalSearch: {}
}

TemporalSelectionDropdown.propTypes = {
  onChangeQuery: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    recurringDayEnd: PropTypes.string,
    recurringDayStart: PropTypes.string,
    startDate: PropTypes.string
  })
}

export default TemporalSelectionDropdown
