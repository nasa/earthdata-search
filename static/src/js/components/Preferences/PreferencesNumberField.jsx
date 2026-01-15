import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'
import Form from 'react-bootstrap/Form'
import { asNumber } from '@rjsf/utils'

import './PreferencesNumberField.scss'

const PreferencesNumberField = ({
  name: fieldName,
  formData: initialFormData = '',
  schema,
  onChange
}) => {
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (event) => {
    let { value } = event.target

    setFormData(value)

    // Borrowed this code from react-jsonschema-form. Its the code they use in their version of NumberField
    // https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/NumberField.tsx#L54
    // Removed the handling of strings with trailing zeros since that is not relevant to our use case

    // Normalize decimals that don't start with a zero character in advance so
    // that the rest of the normalization logic is simpler
    if (`${value}`.charAt(0) === '.') {
      value = `0${value}`
    }

    onChange(asNumber(value))
  }

  const { description } = schema

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
          onChange={handleChange}
          value={formData}
        />
      </div>
    </div>
  )
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
