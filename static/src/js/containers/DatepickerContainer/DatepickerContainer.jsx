import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { formatDate } from '../../util/formatDate'
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
    this.onInputChange = this.onInputChange.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onTodayClick = this.onTodayClick.bind(this)
    this.isValidDate = this.isValidDate.bind(this)

    this.picker = React.createRef()

    this.cleared = false
  }

  /**
   * Set view back to the default when a user closes the datepicker
   * Also set the datetime to be the endOf or startOf day depending on the type
   */
  onBlur(value) {
    const {
      type,
      onSubmit,
      value: oldValue,
      viewMode
    } = this.props

    this.picker.current.setState({
      currentView: viewMode
    })

    if (this.cleared && oldValue === '') {
      this.cleared = false

      return
    }

    const inputMoment = formatDate(moment.utc(value, [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true), type)

    onSubmit(inputMoment)
  }

  /**
  * Clear out the currently selected date
  */
  onClearClick() {
    this.cleared = true

    this.onBlur(null)
  }

  /**
  * Set up the onChange event for the datepicker input
  * @param {event} event - The event passed from the Datetime input component
  */
  async onInputChange(event) {
    const {
      format,
      onSubmit
    } = this.props

    const { target } = event
    const { selectionStart: cursorPosition, value } = target

    const valueToSet = moment.utc(value, format, true)

    onSubmit(valueToSet)

    await setTimeout(() => {
      // Restore the cursor position
      target.setSelectionRange(cursorPosition, cursorPosition)
    }, 0)
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

    this.onBlur(valueToSet)
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

    // Handle disabled dates
    if (!date.isBetween(minDate, maxDate)) return false

    // Show the date
    return true
  }

  render() {
    const {
      id,
      format,
      label,
      size,
      viewMode
    } = this.props

    let { value } = this.props

    // A valid date will come be passed as an ISO string. Check to see if the date is a valid ISO string,
    // if so, we convert it to a UTC string in our desired format. If the value is not a valid ISO date,
    // then we leave it untouched and pass it to the input.
    // We are using YYYY-MM-DDTHH:m:s.SSSZ instead of moment.ISO_8601 so that it doesn't autocomplete every time there's a valid ISO format
    const isValidISO = moment.utc(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()

    if (isValidISO) {
      value = moment.utc(value).format(format)
    }

    return (
      <Datepicker
        id={id}
        format={format}
        isValidDate={this.isValidDate}
        label={label}
        onBlur={this.onBlur}
        onInputChange={this.onInputChange}
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
  viewMode: PropTypes.string
}

export default DatepickerContainer
