import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'

import './Datepicker.scss'

/**
 * Component representing the Datepicker. We use this to make some of the customizations
 * that should be passed down to the react-datetime component
 * @extends PureComponent
 */
class Datepicker extends PureComponent {
  componentDidMount() {
    const {
      onTodayClick,
      onClearClick
    } = this.props

    // Add a custom set of "Today" and "Clear" buttons and insert them into the picker
    const container = ReactDOM.findDOMNode(this).querySelector('.rdtPicker') // eslint-disable-line

    // Container to hold custom buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('datetime__buttons')
    container.appendChild(buttonContainer)

    // Today Button
    const buttonToday = document.createElement('button')
    buttonToday.innerHTML = 'Today'
    buttonToday.type = 'button'
    buttonToday.classList.add('datetime__button', 'datetime__button--today')
    buttonToday.addEventListener('click', onTodayClick)
    buttonContainer.appendChild(buttonToday)

    // Clear Button
    const buttonClear = document.createElement('button')
    buttonClear.innerHTML = 'Clear'
    buttonClear.type = 'button'
    buttonClear.classList.add('datetime__button', 'datetime__button--clear')
    buttonClear.addEventListener('click', onClearClick)
    buttonContainer.appendChild(buttonClear)

    // Adds the new button container to the DOM
    container.appendChild(buttonContainer)
  }

  render() {
    const {
      isValidDate,
      onBlur,
      onChange,
      picker,
      value
    } = this.props

    const { format, id, viewMode } = this.props

    return (
      <Datetime
        className="datetime"
        closeOnSelect
        dateFormat={format}
        inputProps={{
          id,
          placeholder: format,
          autoComplete: 'off'
        }}
        isValidDate={isValidDate}
        onBlur={onBlur}
        onChange={onChange}
        ref={picker}
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
  value: '',
  viewMode: 'years'
}

Datepicker.propTypes = {
  id: PropTypes.string.isRequired,
  format: PropTypes.string,
  isValidDate: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  picker: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ currentView: PropTypes.instanceOf(Element) })
  ]).isRequired,
  value: PropTypes.string,
  viewMode: PropTypes.string
}

export default Datepicker
