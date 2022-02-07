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
      classNames,
      dataTestId,
      name,
      value,
      placeholder
    } = this.props

    return (
      <label htmlFor="input__search-bar" className={classNames.label}>
        <span className={`visually-hidden ${classNames.labelSpan}`}>{placeholder}</span>
        <input
          id="input__search-bar"
          data-test-id={dataTestId}
          name={name}
          type="text"
          placeholder={placeholder}
          className={`${classNames.input}`}
          value={value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
        />
      </label>
    )
  }
}

TextField.defaultProps = {
  classNames: {
    input: null,
    label: null,
    labelSpan: null
  },
  dataTestId: null,
  placeholder: '',
  value: ''
}

TextField.propTypes = {
  classNames: PropTypes.shape({
    input: PropTypes.string,
    label: PropTypes.string,
    labelSpan: PropTypes.string
  }),
  dataTestId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string
}

export default TextField
