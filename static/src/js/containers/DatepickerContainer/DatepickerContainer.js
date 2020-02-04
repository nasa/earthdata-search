import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'

import isCustomTime from '../../util/datepicker'
import Datepicker from '../../components/Datepicker/Datepicker'

class DatepickerContainer extends Component {
  constructor(props) {
    super(props)

    this.isValidDate = this.isValidDate.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onTodayClick = this.onTodayClick.bind(this)

    this.today = moment()
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
  * Check to see if a date should be clickable in the picker
  */
  isValidDate(date) {
    const {
      minDate,
      maxDate,
      isValidDate,
      shouldValidate
    } = this.props

    // If validation is set to false, avoid checking validations
    if (!shouldValidate) return true

    // If a validation callback was provided, execute it
    if (typeof isValidDate === 'function') return isValidDate(date)

    if (minDate && date.isBefore(minDate, 'day')) return false

    if (maxDate && date.isAfter(maxDate, 'day')) return false

    // Show the date
    return true
  }

  render() {
    const {
      id,
      format,
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
        onChange={this.onChange}
        onClearClick={this.onClearClick}
        onTodayClick={this.onTodayClick}
        value={value}
        viewMode={viewMode}
      />
    )
  }
}

DatepickerContainer.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  minDate: '',
  maxDate: '',
  isValidDate: null,
  shouldValidate: true,
  type: '',
  value: '',
  viewMode: 'years'
}

DatepickerContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  format: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  isValidDate: PropTypes.func,
  shouldValidate: PropTypes.bool,
  value: PropTypes.string,
  type: PropTypes.string,
  viewMode: PropTypes.string
}

export default withRouter(
  connect(null, null)(DatepickerContainer)
)
