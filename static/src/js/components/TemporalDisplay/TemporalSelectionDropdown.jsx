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
  temporalSearch,
  onMetricsTemporalFilter
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
      newTemporal.recurringDayStart = `${moment(existingStartDate).utc().dayOfYear()}`

      // Use the start year to calculate the end day of year. This avoids leap years potentially causing day mismatches
      const startYear = moment(existingStartDate).utc().year()
      newTemporal.recurringDayEnd = `${moment(existingEndDate).utc().year(startYear).dayOfYear()}`
    }

    if (onMetricsTemporalFilter) {
      onMetricsTemporalFilter({
        type: 'Apply Temporal Filter',
        value: JSON.stringify(newTemporal)
      })
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
    if (onMetricsTemporalFilter) {
      onMetricsTemporalFilter({
        type: 'Clear Temporal Filter',
        value: {}
      })
    }

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
    if (onMetricsTemporalFilter) {
      onMetricsTemporalFilter({
        type: 'Set Recurring',
        value: isChecked
      })
    }

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

      const newStartDate = moment(existingStartDate || undefined)
        .utc()
        .year(value.min)

      const newEndDate = moment(existingEndDate || undefined)
        .utc()
        .year(value.max)

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
   * @param {moment} shouldCallMetrics - Flag to determine if we want to submit metrics
   * @param {moment} metricType - Type of metric for temporal filter
   */
  const setStartDate = (newStartDate, shouldCallMetrics, metricType) => {
    const {
      isRecurring: existingIsRecurring,
      startDate: existingStartDate
    } = temporal

    if (shouldCallMetrics && onMetricsTemporalFilter) {
      onMetricsTemporalFilter({
        type: `Set Start Date - ${metricType}`,
        value: newStartDate.toISOString()
      })
    }

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
   * @param {moment} shouldCallMetrics - Flag to determine if we want to submit metrics
   * @param {moment} metricType - Type of metric for temporal filter
   */
  const setEndDate = (newEndDate, shouldCallMetrics, metricType) => {
    const {
      endDate: existingEndDate,
      isRecurring: existingIsRecurring
    } = temporal

    if (shouldCallMetrics && onMetricsTemporalFilter) {
      onMetricsTemporalFilter({
        type: `Set End Date - ${metricType}`,
        value: newEndDate.toISOString()
      })
    }

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
  onMetricsTemporalFilter: null,
  temporalSearch: {}
}

TemporalSelectionDropdown.propTypes = {
  allowRecurring: PropTypes.bool,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsTemporalFilter: PropTypes.func,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    recurringDayEnd: PropTypes.string,
    recurringDayStart: PropTypes.string,
    startDate: PropTypes.string
  })
}

export default TemporalSelectionDropdown
