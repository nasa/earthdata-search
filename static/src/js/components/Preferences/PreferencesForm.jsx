import React, { useEffect, useState } from 'react'

import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'

import useEdscStore from '../../zustand/useEdscStore'
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
const PreferencesForm = () => {
  const {
    preferencesData,
    isSubmitting,
    submitAndUpdatePreferences
  } = useEdscStore((state) => ({
    preferencesData: state.preferences.preferences,
    isSubmitting: state.preferences.isSubmitting,
    submitAndUpdatePreferences: state.preferences.submitAndUpdatePreferences
  }))

  const [formData, setFormData] = useState(preferencesData)

  useEffect(() => {
    setFormData(preferencesData)
  }, [preferencesData])

  const onChange = (data) => {
    const { formData: newFormData } = data

    setFormData(newFormData)
  }

  const fields = {
    multiSelect: PreferencesMultiSelectField,
    number: PreferencesNumberField,
    radio: PreferencesRadioField
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
        onSubmit={submitAndUpdatePreferences}
        schema={schema}
        transformErrors={transformErrors}
        uiSchema={uiSchema}
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

export default PreferencesForm
