import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import { Form } from 'react-bootstrap'

import './PreferencesNumberField.scss'

class PreferencesNumberField extends Component {
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
      description
    } = schema

    return (
      <div className="preferences-number-field">
        <div className="preferences-number-field__name">
          <span>{startCase(fieldName)}</span>
        </div>
        <div className="preferences-number-field__description">
          <span>{description}</span>
        </div>
        <div className="preferences-number-field__list">
          <Form.Control
            className="preferences-number-field__input"
            id={`${fieldName}-${fieldName}`}
            key={`${fieldName}-number`}
            label={fieldName}
            name={fieldName}
            onChange={this.onChange()}
            value={formData}
          />
        </div>
      </div>
    )
  }
}

PreferencesNumberField.propTypes = {
  schema: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  formData: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PreferencesNumberField
