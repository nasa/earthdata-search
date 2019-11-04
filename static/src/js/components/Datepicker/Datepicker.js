import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import Datetime from 'react-datetime'

import isCustomTime from '../../util/datepicker'

import './Datepicker.scss'

/**
 * Component representing the Datepicker. We use this to make some of the customizations
 * that should be passed down to the react-datetime component
 * @extends PureComponent
 */
class Datepicker extends PureComponent {
  constructor(props) {
    super(props)
    this.isValidDate = this.isValidDate.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onTodayClick = this.onTodayClick.bind(this)
    this.today = moment()

    this.setRef = (element) => {
      this.picker = element
    }

    this.state = {
      value: ''
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Clear out the value in the input if the component is updated with empty value. This occurs
    // when the props are updated outside of the component (i.e. when the "clear" button) is clicked

    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value }
    }
    return null
  }

  componentDidMount() {
    // Add a custom set of "Today" and "Clear" buttons and insert them into the picker
    const container = ReactDOM.findDOMNode(this).querySelector('.rdtPicker') // eslint-disable-line
    const buttonToday = document.createElement('button')
    const buttonClear = document.createElement('button')
    const buttonContainer = document.createElement('div')

    buttonContainer.classList.add('datetime__buttons')
    container.appendChild(buttonContainer)
    buttonToday.innerHTML = 'Today'
    buttonClear.innerHTML = 'Clear'
    buttonToday.type = 'button'
    buttonClear.type = 'button'
    buttonToday.classList.add('datetime__button', 'datetime__button--today')
    buttonClear.classList.add('datetime__button', 'datetime__button--clear')
    buttonContainer.classList.add('datetime__buttons')
    buttonToday.addEventListener('click', this.onTodayClick)
    buttonClear.addEventListener('click', this.onClearClick)
    buttonContainer.appendChild(buttonToday)
    buttonContainer.appendChild(buttonClear)
    container.appendChild(buttonContainer)
  }

  /**
  * Set view back to the default when a user closes the datepicker
  */
  onBlur() {
    const { viewMode } = this.props

    this.picker.setState({
      currentView: viewMode
    })
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
      isValidDate,
      onBlur,
      onChange,
      setRef
    } = this

    const { format, id, viewMode } = this.props
    let { value } = this.state

    // A valid date will come be passed as an ISO string. Check to see if the date is a valid ISO string,
    // if so, we convert it to a UTC string in our desired format. If the value is not a valid ISO date,
    // then we leave it untouched and pass it to the input.
    const isValidISO = moment.utc(value, 'YYYY-MM-DDTHH:m:s.SSSZ', true).isValid()

    if (isValidISO) {
      value = moment.utc(value).format(format)
    }

    return (
      <Datetime
        className="datetime"
        closeOnSelect
        dateFormat={format}
        inputProps={{
          id,
          placeholder: format
        }}
        isValidDate={isValidDate}
        onBlur={onBlur}
        onChange={onChange}
        ref={setRef}
        timeFormat={false}
        utc
        value={value}
        viewMode={viewMode}
      />
    )
  }
}

Datepicker.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  minDate: '',
  maxDate: '',
  isValidDate: null,
  shouldValidate: true,
  type: '',
  value: '',
  viewMode: 'years'
}

Datepicker.propTypes = {
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  format: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  isValidDate: PropTypes.func,
  shouldValidate: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
  viewMode: PropTypes.string
}

export default Datepicker
