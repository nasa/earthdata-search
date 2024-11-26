import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'

import './Datepicker.scss'

/**
 * Component representing the Datepicker. Used to make some of the customizations
 * that should be passed down to the react-datetime component
 * @extends PureComponent
 * @param {Object} props - The props passed into the component.
 * @param {String} props.id - A unique id
 * @param {String} props.format - A string temporal format
 * @param {Function} props.isValidDate - Callback function to determine if a date is valid
 * @param {Function} props.onBlur - Callback function to call when the field is blurred
 * @param {Function} props.onChange - Callback function to call when the field is changed
 * @param {Function} props.onClearClick - Callback function to call when the clear button is clicked
 * @param {Function} props.onTodayClick - Callback function to call when the today button is clicked
 * @param {Node} props.picker - A ref for the datepicker
 * @param {String} props.size - String representing the bootstrap size
 * @param {String} props.value - The value to be used in the input
 * @param {String} props.viewMode - The default view mode for the picker
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

    // Set up navigation button click handlers
    this.setupNavigationHandlers(container)
  }

  componentDidUpdate(prevProps) {
    const {
      viewMode: previousViewMode
    } = prevProps

    const {
      viewMode,
      picker
    } = this.props

    // If the viewMode has changed, navigate to the new viewMode
    if (previousViewMode !== viewMode) picker.current.navigate(viewMode)
  }

  componentWillUnmount() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }
  }

  onInputChange(event) {
    const caret = event.target.selectionStart
    const element = event.target

    // Set the current cursor selection to prevent cursor moving to the end of the field when editing
    window.requestAnimationFrame(() => {
      element.selectionStart = caret
      element.selectionEnd = caret
    })
  }

  setupNavigationHandlers(container) {
    // Monitor clicks on the entire container
    container.addEventListener('click', (event) => {
      // Handle month selection
      if (event.target.classList.contains('rdtMonth')) {
        setTimeout(() => this.updateNavigationArrows(), 0)
      }

      // Handle navigation arrows
      if (event.target.classList.contains('rdtPrev')
          || event.target.parentElement.classList.contains('rdtPrev')
          || event.target.classList.contains('rdtNext')
          || event.target.parentElement.classList.contains('rdtNext')) {
        setTimeout(() => this.updateNavigationArrows(), 0)
      }

      // Handle going back to months view
      if (event.target.classList.contains('rdtSwitch')) {
        // Reset arrow visibility when going back to months view
        const prevButton = container.querySelector('.rdtPrev')
        const nextButton = container.querySelector('.rdtNext')
        if (prevButton) {
          prevButton.innerHTML = '<span>‹</span>'
          prevButton.style.pointerEvents = ''
          prevButton.style.visibility = 'visible'
        }

        if (nextButton) {
          nextButton.innerHTML = '<span>›</span>'
          nextButton.style.pointerEvents = ''
          nextButton.style.visibility = 'visible'
        }
      }
    })
  }

  updateNavigationArrows() {
    const { viewMode } = this.props

    if (viewMode !== 'months') return

    const container = ReactDOM.findDOMNode(this).querySelector('.rdtPicker') // eslint-disable-line
    if (!container) return

    const isDayView = container.querySelector('.rdtDays') !== null

    if (!isDayView) return

    const prevButton = container.querySelector('.rdtPrev')
    const nextButton = container.querySelector('.rdtNext')
    const monthDisplay = container.querySelector('.rdtSwitch')

    if (!monthDisplay) return

    // Modify month display to remove year
    const [monthStr] = monthDisplay.textContent.split(' ')
    monthDisplay.textContent = monthStr

    const currentMonth = new Date(`${monthStr} 1, 2000`).getMonth()

    // Check if navigation would cross year boundary
    if (prevButton) {
      if (currentMonth === 0) {
        prevButton.innerHTML = ''
        prevButton.style.pointerEvents = 'none'
        prevButton.style.visibility = 'hidden'
      } else {
        prevButton.innerHTML = '<span>‹</span>'
        prevButton.style.pointerEvents = ''
        prevButton.style.visibility = 'visible'
      }
    }

    if (nextButton) {
      if (currentMonth === 11) {
        nextButton.innerHTML = ''
        nextButton.style.pointerEvents = 'none'
        nextButton.style.visibility = 'hidden'
      } else {
        nextButton.innerHTML = '<span>›</span>'
        nextButton.style.pointerEvents = ''
        nextButton.style.visibility = 'visible'
      }
    }
  }

  render() {
    const {
      filterType,
      isValidDate,
      label,
      onChange,
      picker,
      size,
      value,
      onInputBlur,
      onInputFocus
    } = this.props
    const { format, id, viewMode } = this.props
    const conditionalInputProps = {}

    // React-datetime does not clear out the input field when a empty string is received. When
    // the value is an empty string, the value is manually set on the input via `inputProps`.
    if (!value) {
      conditionalInputProps.value = ''
    }

    const onKeyDown = (event) => {
      // If the user presses `Enter`, the field should behave the same as bluring the input
      if (event.key === 'Enter') onInputBlur(event)
    }

    return (
      <Datetime
        className="datetime"
        closeOnClickOutside
        closeOnSelect
        closeOnTab
        dateFormat={format}
        initialViewMode={viewMode}
        inputProps={
          {
            id,
            placeholder: format,
            autoComplete: 'off',
            className: `form-control ${size === 'sm' ? 'form-control-sm' : ''}`,
            'aria-label': label,
            onChange: (event) => {
              this.onInputChange(event)
              // eslint-disable-next-line no-underscore-dangle
              picker.current._closeCalendar()
              if (filterType === 'collection') {
                onChange(event.target.value, false, 'Typed')
              }
            },
            onBlur: onInputBlur,
            onFocus: onInputFocus,
            onKeyDown,
            ...conditionalInputProps
          }
        }
        isValidDate={isValidDate}
        onChange={onChange}
        onOpen={
          () => {
            setTimeout(() => {
            // Set up initial handlers and arrows when calendar opens
            const container = ReactDOM.findDOMNode(this).querySelector('.rdtPicker') // eslint-disable-line
              if (container) {
                this.setupNavigationHandlers(container)
                this.updateNavigationArrows()
              }
            }, 0)
          }
        }
        ref={picker}
        strictParsing
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
  label: '',
  size: '',
  value: '',
  viewMode: 'years',
  onInputFocus: null
}

Datepicker.propTypes = {
  filterType: PropTypes.string.isRequired,
  format: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isValidDate: PropTypes.func.isRequired,
  onInputBlur: PropTypes.func.isRequired,
  onInputFocus: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  picker: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ currentView: PropTypes.instanceOf(Element) })
  ]).isRequired,
  size: PropTypes.string,
  value: PropTypes.string,
  viewMode: PropTypes.string
}

export default Datepicker
