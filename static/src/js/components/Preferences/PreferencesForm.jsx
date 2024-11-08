import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'

import schema from '../../../../../schemas/sitePreferencesSchema.json'
import uiSchema from '../../../../../schemas/sitePreferencesUISchema.json'
import Button from '../Button/Button'
import PreferencesRadioField from './PreferencesRadioField'
import PreferencesNumberField from './PreferencesNumberField'
import PreferencesMultiSelectField from './PreferencesMultiSelectField'

import './PreferencesForm.scss'

/**
 * Renders the Preferences form
 */
const PreferencesForm = (props) => {
  const { preferences, onUpdatePreferences } = props
  const {
    isSubmitting,
    preferences: formDataProps
  } = preferences

  const [formData, setFormData] = useState(formDataProps)

  useEffect(() => {
    setFormData(formDataProps)
  }, [formDataProps])

  const onChange = (data) => {
    const { formData: newFormData } = data

    setFormData(newFormData)
  }

  const fields = {
    multiSelect: PreferencesMultiSelectField,
    number: PreferencesNumberField,
    radio: PreferencesRadioField
  }

  const validate = (formDataObject, errors) => {
    // Projections that aren't geographic have a zoom limit of 4
    if (formDataObject.mapView.projection !== 'epsg4326' && formDataObject.mapView.zoom > 4) {
      errors.mapView.zoom.addError('should be less than or equal to 4')
    }

    return errors
  }

  const transformErrors = (errors) => errors.map((error) => {
    // eslint-disable-next-line no-param-reassign
    error.message = error.message.replace('<=', 'less than or equal to')
    // eslint-disable-next-line no-param-reassign
    error.message = error.message.replace('>=', 'greater than or equal to')

    return error
  })

  return (
    <div className="preferences-form">
      <Form
        idPrefix="preferences-form"
        fields={fields}
        formData={formData}
        liveValidate
        onChange={onChange}
        onSubmit={onUpdatePreferences}
        schema={schema}
        transformErrors={transformErrors}
        uiSchema={uiSchema}
        validate={validate}
        validator={validator}
      >
        <div>
          <Button
            className="preferences-form__submit"
            label="Submit"
            type="submit"
            bootstrapVariant="primary"
            spinner={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

PreferencesForm.propTypes = {
  onUpdatePreferences: PropTypes.func.isRequired,
  preferences: PropTypes.shape({
    isSubmitting: PropTypes.bool,
    preferences: PropTypes.shape({})
  }).isRequired
}

export default PreferencesForm
