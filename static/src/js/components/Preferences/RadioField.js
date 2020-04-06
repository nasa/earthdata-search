import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

class RadioField extends Component {
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
      <div className="preferences-form__radio">
        <div className="preferences-form__radio-name">
          <span>{startCase(fieldName)}</span>
        </div>
        <div className="preferences-form__radio-description">
          <span>{description}</span>
        </div>
        <div className="preferences-form__radio-list">
          {
            values.map((value, index) => {
              const name = enumNames[index]

              return (
                <div key={`${name}-radio`}>
                  <label
                    htmlFor={`${fieldName}-${name}`}
                  >
                    <input
                      className="preferences-form__radio__input"
                      id={`${fieldName}-${name}`}
                      type="radio"
                      name={fieldName}
                      value={value}
                      checked={value === formData ? 'checked' : ''}
                      onChange={this.onChange()}
                    />
                    <span className="preferences-form__radio__label">{name}</span>
                  </label>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

RadioField.propTypes = {
  schema: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  formData: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RadioField
