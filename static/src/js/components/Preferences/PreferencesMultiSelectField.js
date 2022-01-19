import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import { Form } from 'react-bootstrap'

import './PreferencesMultiSelectField.scss'

class PreferencesMultiSelectField extends Component {
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
      const values = Array.from(event.target.selectedOptions).map((option) => {
        const { value } = option

        return value
      })

      this.setState({
        formData: values
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

    const { items } = schema
    const {
      enum: values,
      enumNames,
      description
    } = items

    return (
      <div className="preferences-multi-select-field">
        <div className="preferences-multi-select-field__name">
          <span>{startCase(fieldName)}</span>
        </div>
        <div className="preferences-multi-select-field__description">
          <span>{description}</span>
        </div>
        <div className="preferences-multi-select-field__list">
          <Form.Control
            as="select"
            className="preferences-multi-select-field__input"
            id={`${fieldName}-${fieldName}`}
            key={`${fieldName}-multi-select`}
            label={fieldName}
            multiple
            name={fieldName}
            onChange={this.onChange()}
            value={formData}
          >
            {
              values.map((value, index) => {
                const name = enumNames[index]

                return (
                  <option
                    key={`${value}-option`}
                    value={value}
                  >
                    {name}
                  </option>
                )
              })
          }
          </Form.Control>
        </div>
      </div>
    )
  }
}

PreferencesMultiSelectField.propTypes = {
  formData: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    items: PropTypes.shape({
      enum: PropTypes.shape({}),
      enumNames: PropTypes.shape({}),
      description: PropTypes.string
    })
  }).isRequired
}

export default PreferencesMultiSelectField
