import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'

import schema from '../../../../../schemas/sitePreferencesSchema.json'
import uiSchema from '../../../../../schemas/sitePreferencesUISchema.json'

import Button from '../Button/Button'
import PreferencesRadioField from './PreferencesRadioField'
import PreferencesNumberField from './PreferencesNumberField'
import PreferencesMultiSelectField from './PreferencesMultiSelectField'

import useEdscStore from '../../zustand/useEdscStore'
import { getSitePreferences } from '../../zustand/selectors/user'

import UPDATE_PREFERENCES from '../../operations/mutations/updatePreferences'

import addToast from '../../util/addToast'
import { DISPLAY_NOTIFICATION_TYPE } from '../../constants/displayNotificationType'

import './PreferencesForm.scss'

/**
 * Renders the Preferences form
 */
const PreferencesForm = () => {
  const sitePreferences = useEdscStore(getSitePreferences)
  const setSitePreferences = useEdscStore((state) => state.user.setSitePreferences)
  const handleError = useEdscStore((state) => state.errors.handleError)

  const [formData, setFormData] = useState(sitePreferences)

  useEffect(() => {
    setFormData(sitePreferences)
  }, [sitePreferences])

  const [updatePreferencesMutation, { loading }] = useMutation(UPDATE_PREFERENCES)

  const handleSubmit = async ({ formData: newFormData }) => {
    updatePreferencesMutation({
      variables: {
        preferences: newFormData
      },
      onCompleted: (data) => {
        const { updatePreferences: updatedUser } = data
        const { sitePreferences: updatedPreferences } = updatedUser

        setSitePreferences(updatedPreferences)

        addToast('Preferences saved!', {
          appearance: 'success',
          autoDismiss: true
        })
      },
      onError: (error) => {
        handleError({
          error,
          action: 'updatePreferences',
          resource: 'preferences',
          requestObject: null,
          notificationType: DISPLAY_NOTIFICATION_TYPE.TOAST
        })
      }
    })
  }

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
        onSubmit={handleSubmit}
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
            spinner={loading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PreferencesForm
