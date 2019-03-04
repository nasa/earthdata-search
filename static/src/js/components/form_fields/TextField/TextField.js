import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TextField extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleChange(event) {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const { onChange } = this.props
    onChange(fieldName, fieldValue)
  }

  handleBlur(event) {
    const { onBlur } = this.props
    onBlur(event)
  }

  render() {
    const {
      name,
      value
    } = this.props

    return (
      <label htmlFor="input__search-bar">
        <span className="visually-hidden">Search</span>
        <input
          id="input__search-bar"
          name={name}
          type="text"
          placeholder="Search"
          className="search-form__input"
          value={value}
          onBlur={this.handleBlur}
          // onKeyPress={this.handleKeypress}
          onChange={this.handleChange}
        />
      </label>
    )
  }
}

TextField.defaultProps = {
  value: ''
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default TextField
