import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'

import isCustomTime from '../../util/datepicker'
import Datepicker from '../../components/Datepicker/Datepicker'
import { metricsTemporalFilter } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsTemporalFilter: (data) => dispatch(metricsTemporalFilter(data))
})

/**
 * DatepickerContainer component
 * @extends Component
 * @param {Object} props - The props passed into the component.
 * @param {String} props.filterType - A string indicating the datepicker filter context (collection or granule)
 * @param {String} props.format - A string temporal format
 * @param {String} props.id - A unique id
 * @param {String} props.label - A label to provide to the Datepicker
 * @param {Function} props.maxDate - String representing the maximum date
 * @param {Function} props.minDate - String representing the minimum date
 * @param {Function} props.onSubmit - Callback function to call when the date is submitted
 * @param {Function} props.shouldValidate - Flag designating whether or not the picker should validate the input
 * @param {Function} props.onMetricsTemporalFilter - Function for logging to temporalFilter metric data layer
 * @param {String} props.type - String designating the start or end
 * @param {String} props.size - String representing the bootstrap size
 * @param {String} props.value - The value to be used in the input
 * @param {String} props.viewMode - The default view mode for the picker
 */
export const DatepickerContainer = ({
  format,
  id,
  filterType,
  label,
  maxDate,
  minDate,
  onSubmit,
  shouldValidate,
  size,
  type,
  value,
  viewMode,
  onMetricsTemporalFilter
}) => {
  const pickerRef = useRef()
  const [valueWhenFocused, setValueWhenFocused] = useState()

  /**
  * Set up the onChange event for the datepicker
  * @param {moment|string} newValue - The value passed from the Datetime component
  * @param {boolean} [shouldSubmit] - Should this change result in submitting the temporal value. True for clicking a date, or bluring the field, but false for typing characters in the text field.
  * @param {string} metricType - Flag to indicate whether the onChange was triggered from a user typing or using the calendar
  */
  const onChange = (newValue, shouldSubmit = false, metricType = 'calendar') => {
    let valueToSet = null

    // Check to see if the current date is a moment object, and whether or not it has a
    // custom time set (i.e. not 00:00:00 or 23:59:59), if it doesn't, set the time to either
    // the start or end of the day based on the input 'type'. If it does have a custom time, or
    // it is a string from an invalid date, we wrap it in a moment object to pass to the callback.
    // We do this for the invalid date strings so we can call moment.isValid on any value passed
    // out of the callback.
    if (typeof newValue !== 'string' && moment.isMoment(newValue) && !isCustomTime(newValue)) {
      let newValueISO = ''
      if (newValue != null) {
        newValueISO = newValue.toISOString()
      }

      if (type === 'start') {
        if (newValueISO !== value.toString() && filterType === 'collection') {
          onMetricsTemporalFilter({
            type: `Set Start Date - ${metricType}`,
            value: newValueISO
          })
        }

        valueToSet = newValue.startOf('day')
      }

      if (type === 'end') {
        // Using moment.ISO_8601 to determine format of the user input
        const isoDate = moment.utc(newValue.creationData().input, moment.ISO_8601)
        const { format: dateFormat } = isoDate.creationData()

        if (newValueISO !== value.toString() && filterType === 'collection') {
          onMetricsTemporalFilter({
            type: `Set End Date - ${metricType}`,
            value: newValueISO
          })
        }

        if (dateFormat === 'YYYY') {
          valueToSet = newValue.endOf('year')
        } else if (dateFormat === 'YYYY-MM') {
          valueToSet = newValue.endOf('month')
        } else {
          valueToSet = newValue.endOf('day')
        }
      }

      // If the onChange was called with a moment object, we want to force shouldSubmit to be true.
      // This happens when a date is clicked in the picker to complete the selection.
      onSubmit(valueToSet, true)

      return
    }

    valueToSet = moment.utc(newValue, format, true)

    onSubmit(valueToSet, shouldSubmit)
  }

  /**
  * Autocomplete the field on blur
  */
  const onInputBlur = (event) => {
    const { value: newValue } = event.target

    if (newValue === valueWhenFocused) {
      return
    }

    if (moment.utc(newValue, [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true).isValid()) {
      onChange(moment.utc(newValue, format), true, 'typed')
    }
  }

  /**
  * Saves current value of the input field when focused
  */
  const onInputFocus = (event) => {
    const { value: newValue } = event.target

    setValueWhenFocused(newValue)
  }

  /**
  * Clear out the currently selected date
  */
  const onClearClick = () => {
    // Reset the time to a default value to override any previous custom time entry
    onChange(moment().utc().startOf('day').format(format), false)
    onChange('', true)

    // eslint-disable-next-line no-underscore-dangle
    if (pickerRef.current?._closeCalendar) pickerRef.current._closeCalendar()
  }

  /**
   * Set the date to today using the beginning of the day for "Start" and the end of the day for "End"
   */
  const onTodayClick = () => {
    const today = moment().utc()
    let valueToSet = null

    if (type === 'start') {
      valueToSet = today.startOf('day')
    } else if (type === 'end') {
      valueToSet = today.endOf('day')
    }

    if (filterType === 'collection' && valueToSet != null) {
      const typeCapitalized = type === 'start' ? 'Start' : 'End'
      onMetricsTemporalFilter({
        type: `Set ${typeCapitalized} Date - Today`,
        value: valueToSet.toISOString()
      })
    }

    onChange(valueToSet ? valueToSet.format(format) : valueToSet, true)

    // eslint-disable-next-line no-underscore-dangle
    if (pickerRef.current?._closeCalendar) pickerRef.current._closeCalendar()
  }

  /**
  * Check to see if a date should be clickable in the picker
  */
  const isValidDate = (date) => {
    // TODO: This method is SUPER slow because it gets called for every single date.
    // If validation is set to false, avoid checking validations
    if (!shouldValidate) return true

    // Handle disabled dates
    if (!date.isBetween(minDate, maxDate)) return false

    // Show the date
    return true
  }

  // A valid date will come be passed as an ISO string. Check to see if the date is a valid ISO string,
  // if so, we convert it to a UTC string in our desired format. If the value is not a valid ISO date,
  // then we leave it untouched and pass it to the input.
  const isValidISO = moment.utc(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()

  let formattedValue = value

  if (isValidISO) {
    formattedValue = moment.utc(formattedValue).format(format)
  }

  return (
    <Datepicker
      id={id}
      format={format}
      isValidDate={isValidDate}
      label={label}
      onInputBlur={onInputBlur}
      onInputFocus={onInputFocus}
      onChange={onChange}
      onClearClick={onClearClick}
      onTodayClick={onTodayClick}
      picker={pickerRef}
      size={size}
      value={formattedValue}
      viewMode={viewMode}
    />
  )
}

DatepickerContainer.defaultProps = {
  filterType: null,
  format: 'YYYY-MM-DD HH:mm:ss',
  label: '',
  maxDate: '',
  minDate: '',
  shouldValidate: true,
  size: '',
  type: '',
  value: '',
  viewMode: 'years'
}

DatepickerContainer.propTypes = {
  filterType: PropTypes.string,
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  shouldValidate: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  viewMode: PropTypes.string,
  onMetricsTemporalFilter: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(DatepickerContainer)
