import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import isCustomTime from '../../util/datepicker'
import Datepicker from '../../components/Datepicker/Datepicker'

/**
 * DatepickerContainer component
 * @extends Component
 * @param {Object} props - The props passed into the component.
 * @param {String} props.format - A string temporal format
 * @param {String} props.id - A unique id
 * @param {Function} props.maxDate - String representing the maximum date
 * @param {Function} props.minDate - String representing the minimum date
 * @param {Function} props.onSubmit - Callback function to call when the date is submitted
 * @param {Function} props.shouldValidate - Flag designating whether or not the picker should validate the input
 * @param {String} props.type - String designating the start or end
 * @param {String} props.size - String representing the bootstrap size
 * @param {String} props.value - The value to be used in the input
 * @param {String} props.viewMode - The default view mode for the picker
 */
class DatepickerContainer extends Component {
  constructor(props) {
    super(props)

    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onTodayClick = this.onTodayClick.bind(this)
    this.isValidDate = this.isValidDate.bind(this)

    this.picker = React.createRef()
  }

  /**
   * Set view back to the default when a user closes the datepicker
   */
  onBlur() {
    const { viewMode } = this.props

    this.picker.current.setState({
      currentView: viewMode
    })
  }

  /**
  * Clear out the currently selected date
  */
  onClearClick() {
    this.onChange('')
  }

  /**
  * Set up the onChange event for the datepicker
  * @param {moment|string} value - The value passed from the Datetime component
  */
  onChange(value) {
    const {
      format,
      onSubmit,
      type
    } = this.props

    let valueToSet = null

    // Check to see if the current date is a moment object, and whether or not it has a
    // custom time set (i.e. not 00:00:00 or 23:59:59), if it doesn't, set the time to either
    // the start or end of the day based on the input 'type'. If it does have a custom time, or
    // it is a string from an invalid date, we wrap it in a moment object to pass to the callback.
    // We do this for the invalid date strings so we can call moment.isValid on any value passed
    // out of the callback.
    if (typeof value !== 'string' && moment.isMoment(value) && !isCustomTime(value)) {
      if (type === 'start') {
        valueToSet = value.startOf('day')
      } else if (type === 'end') {
        valueToSet = value.endOf('day')
      }
    } else {
      valueToSet = moment.utc(value, format, true)
    }

    onSubmit(valueToSet)
  }

  /**
   * Set the date to today using the beginning of the day for "Start" and the end of the day for "End"
   */
  onTodayClick() {
    const { type } = this.props

    const today = moment().utc()
    let valueToSet = null

    if (type === 'start') {
      valueToSet = today.startOf('day')
    } else if (type === 'end') {
      valueToSet = today.endOf('day')
    }

    this.onChange(valueToSet)
  }

  /**
  * Check to see if a date should be clickable in the picker
  */
  isValidDate(date) {
    // TODO: This method is SUPER slow because it gets called for every single date.
    const {
      minDate,
      maxDate,
      shouldValidate
    } = this.props

    // If validation is set to false, avoid checking validations
    if (!shouldValidate) return true

    // If a validation callback was provided, execute it
    if (typeof isValidDate === 'function') return this.isValidDate(date)

    // Handle disabled dates
    if (!date.isBetween(minDate, maxDate)) return false

    // Show the date
    return true
  }

  render() {
    const {
      id,
      format,
      size,
      viewMode
    } = this.props

    let { value } = this.props

    // A valid date will come be passed as an ISO string. Check to see if the date is a valid ISO string,
    // if so, we convert it to a UTC string in our desired format. If the value is not a valid ISO date,
    // then we leave it untouched and pass it to the input.
    const isValidISO = moment.utc(value, 'YYYY-MM-DDTHH:m:s.SSSZ', true).isValid()

    if (isValidISO) {
      value = moment.utc(value).format(format)
    }
    return (
      <Datepicker
        id={id}
        format={format}
        isValidDate={this.isValidDate}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onClearClick={this.onClearClick}
        onTodayClick={this.onTodayClick}
        picker={this.picker}
        size={size}
        value={value}
        viewMode={viewMode}
      />
    )
  }
}

DatepickerContainer.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  maxDate: '',
  minDate: '',
  shouldValidate: true,
  size: '',
  type: '',
  value: '',
  viewMode: 'years'
}

DatepickerContainer.propTypes = {
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  shouldValidate: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  viewMode: PropTypes.string
}

export default DatepickerContainer
