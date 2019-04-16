import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import Datetime from 'react-datetime'

import './Datepicker.scss'

class Datepicker extends PureComponent {
  constructor(props) {
    super(props)
    const { value } = props
    this.format = 'YYYY-MM-DD HH:mm:ss'
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
      value: value || ''
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

    buttonToday.innerHTML = 'Today'
    buttonClear.innerHTML = 'Clear'
    buttonToday.classList.add('datetime__button')
    buttonClear.classList.add('datetime__button')
    buttonContainer.classList.add('datetime__buttons')
    buttonToday.addEventListener('click', this.onTodayClick)
    buttonClear.addEventListener('click', this.onClearClick)
    buttonContainer.appendChild(buttonToday)
    buttonContainer.appendChild(buttonClear)
    container.appendChild(buttonContainer)
  }

  onBlur(value) {
    const {
      onSubmit
    } = this.props

    // Set strict parsing so we can use isValid on the date
    const valueFromForm = moment.utc(value, 'YYYY-MM-DD HH:mm:ss', true)

    this.setState({
      value: valueFromForm
    })

    onSubmit(valueFromForm)

    // Set the picker back to the 'years' view
    this.picker.setState({
      currentView: 'years'
    })
  }

  /**
  * Set the date to today using the beginning of the day for "Start" and the end of the day for "End"
  */
  onTodayClick() {
    const {
      onSubmit,
      type
    } = this.props

    const today = moment().utc()
    let valueToSet = null

    if (type === 'start') {
      valueToSet = today.startOf('day')
    } else if (type === 'end') {
      valueToSet = today.endOf('day')
    }

    onSubmit(valueToSet)
  }

  /**
  * Clear out the currently selected date
  */
  onClearClick() {
    const { onSubmit } = this.props
    onSubmit('')
  }

  /**
  * Set up the onChange event for the datepicker
  */
  onChange(value) {
    const {
      onSubmit,
      type
    } = this.props

    // value will only ever be a moment object when a user clicks an item from the picker. We need to manually trigger the submission to the parent component
    if (typeof value !== 'string' && value instanceof moment) {
      let valueToSet = null

      // Set the date to UTC to avoid timezone issues
      value.utc()

      if (type === 'start') {
        valueToSet = value.startOf('day')
      } else if (type === 'end') {
        valueToSet = value.endOf('day')
      }

      onSubmit(valueToSet)
    }
  }

  /**
  * Check to see if a date should be clickable in the picker
  */
  isValidDate(date) {
    // Is the date before 1960?
    if (date.isBefore('1960-01-01', 'year')) return false

    // Is the date after today?
    if (date.isAfter(this.today, 'day')) return false

    // Show the date
    return true
  }

  render() {
    const {
      format,
      isValidDate,
      onBlur,
      onChange,
      onNavigateBack,
      setRef,
      state
    } = this
    let { value } = state

    // If we are passing a value, make sure it is the correct format
    if (value) value = moment(value, moment.HTML5_FMT.DATETIME_LOCAL_MS).format(format)

    return (
      <Datetime
        className="datetime"
        closeOnSelect
        dateFormat="YYYY-MM-DD HH:mm:ss"
        inputProps={{ placeholder: 'YYYY-MM-DD HH:mm:ss' }}
        isValidDate={isValidDate}
        onBlur={onBlur}
        onChange={onChange}
        onNavigateBack={onNavigateBack}
        ref={setRef}
        timeFormat={false}
        value={value}
        viewMode="years"
      />
    )
  }
}

Datepicker.defaultProps = {
  type: '',
  value: ''
}

Datepicker.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}

export default Datepicker
