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
  constructor(props) {
    super(props)

    this.onBlur = this.onBlur.bind(this)

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
    const {
      onTodayClick,
      onClearClick
    } = this.props

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
    buttonToday.addEventListener('click', onTodayClick)
    buttonClear.addEventListener('click', onClearClick)
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

  render() {
    const {
      setRef
    } = this

    const {
      isValidDate,
      onChange,
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
        onBlur={this.onBlur}
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
  value: '',
  viewMode: 'years'
}

Datepicker.propTypes = {
  id: PropTypes.string.isRequired,
  format: PropTypes.string,
  isValidDate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  value: PropTypes.string,
  viewMode: PropTypes.string
}

export default Datepicker
