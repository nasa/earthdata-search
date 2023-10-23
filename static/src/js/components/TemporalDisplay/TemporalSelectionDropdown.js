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
 */
const TemporalSelectionDropdown = ({
  allowRecurring,
  onChangeQuery,
  temporalSearch
}) => {
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
   * Sets the current start and end dates values in the Redux store
   */
  const onApplyClick = () => {
    const {
      endDate: existingEndDate,
      isRecurring: existingIsRecurring,
      startDate: existingStartDate
    } = temporal

    const newTemporal = {
      startDate: existingStartDate,
      endDate: existingEndDate,
      isRecurring: existingIsRecurring
    }

    if (existingIsRecurring) {
      newTemporal.recurringDayStart = moment(existingStartDate).utc().dayOfYear()
      newTemporal.recurringDayEnd = moment(existingEndDate).utc().dayOfYear()
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
      const {
        startDate: existingStartDate,
        endDate: existingEndDate
      } = temporal

      const newStartDate = moment(existingStartDate || undefined).utc()
      newStartDate.set({
        year: value.min,
        hour: '00',
        minute: '00',
        second: '00'
      })

      const newEndDate = moment(existingEndDate || undefined).utc()
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
    } catch (error) {
      console.log(error)
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
   * @param {moment} newStartDate - The moment object representing the startDate
   */
  const setStartDate = (newStartDate) => {
    const {
      isRecurring: existingIsRecurring,
      startDate: existingStartDate
    } = temporal

    if (existingIsRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const startDateObject = moment(existingStartDate, temporalDateFormatFull)

      newStartDate.year(startDateObject.year())
    }

    setTemporal({
      ...temporal,
      // eslint-disable-next-line no-underscore-dangle
      startDate: newStartDate.isValid() ? newStartDate.toISOString() : newStartDate._i
    })
  }

  /**
   * Set the endDate prop
   * @param {moment} newEndDate - The moment object representing the endDate
   */
  const setEndDate = (newEndDate) => {
    const {
      endDate: existingEndDate,
      isRecurring: existingIsRecurring
    } = temporal

    if (existingIsRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const endDateObject = moment(existingEndDate, temporalDateFormatFull)

      newEndDate.year(endDateObject.year())
    }

    setTemporal({
      ...temporal,
      // eslint-disable-next-line no-underscore-dangle
      endDate: newEndDate.isValid() ? newEndDate.toISOString() : newEndDate._i
    })
  }

  return (
    <Dropdown show={open} className="temporal-selection-dropdown" onToggle={onToggleOpen}>
      <TemporalSelectionDropdownToggle onToggleClick={onToggleOpen} />
      {
        open && (
          <TemporalSelectionDropdownMenu
            allowRecurring={allowRecurring}
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
  allowRecurring: true,
  temporalSearch: {}
}

TemporalSelectionDropdown.propTypes = {
  allowRecurring: PropTypes.bool,
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
