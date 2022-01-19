import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { Form } from 'react-bootstrap'
import { asNumber } from 'react-jsonschema-form/lib/utils'

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
        let { formData } = this.state

        // Borrowed this code from react-jsonschema-form. Its the code they use in their version of NumberField
        // https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/src/components/fields/NumberField.js#L44

        // Normalize decimals that don't start with a zero character in advance so
        // that the rest of the normalization logic is simpler
        if (`${formData}`.charAt(0) === '.') {
          formData = `0${formData}`
        }

        // Check that the value is a string (this can happen if the widget used is a
        // <select>, due to an enum declaration etc) then, if the value ends in a
        // trailing decimal point or multiple zeroes, strip the trailing values
        const trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/
        const trailingCharMatcher = /[0.]0*$/
        const processed = typeof formData === 'string' && formData.match(trailingCharMatcherWithPrefix)
          ? asNumber(formData.replace(trailingCharMatcher, ''))
          : asNumber(formData)

        const value = processed || processed === 0 ? processed : formData

        return onChange(value)
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
            type="number"
            onChange={this.onChange()}
            value={formData}
          />
        </div>
      </div>
    )
  }
}

PreferencesNumberField.defaultProps = {
  formData: ''
}

PreferencesNumberField.propTypes = {
  formData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default PreferencesNumberField
