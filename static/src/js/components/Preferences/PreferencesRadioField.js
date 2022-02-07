import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import { Form } from 'react-bootstrap'

import './PreferencesRadioField.scss'

class PreferencesRadioField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: props.formData
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange() {
    const { onChange } = this.props

    return (event) => {
      this.setState({
        formData: event.target.value
      }, () => {
        const { formData } = this.state
        return onChange(formData)
      })
    }
  }

  render() {
    const {
      name: fieldName,
      formData,
      schema
    } = this.props

    const {
      enum: values,
      enumNames,
      description
    } = schema

    return (
      <div className="preferences-radio-field">
        <div className="preferences-radio-field__name">
          <span>{startCase(fieldName)}</span>
        </div>
        <div className="preferences-radio-field__description">
          <span>{description}</span>
        </div>
        <div className="preferences-radio-field__list">
          {
            values.map((value, index) => {
              const name = enumNames[index]

              return (
                <Form.Check
                  key={`${name}-radio`}
                  className="preferences-radio-field__input"
                  inline
                  id={`${fieldName}-${name}`}
                  type="radio"
                  label={name}
                  name={fieldName}
                  value={value}
                  checked={value === formData ? 'checked' : ''}
                  onChange={this.onChange()}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}

PreferencesRadioField.propTypes = {
  formData: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    enum: PropTypes.arrayOf(PropTypes.string),
    enumNames: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string
  }).isRequired
}

export default PreferencesRadioField
