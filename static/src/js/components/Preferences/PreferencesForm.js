import React, {
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'

import Form from 'react-jsonschema-form'

import schema from '../../../../../schemas/sitePreferencesSchema.json'
import uiSchema from '../../../../../schemas/sitePreferencesUISchema.json'
import Button from '../Button/Button'
import PreferencesRadioField from './PreferencesRadioField'
import PreferencesNumberField from './PreferencesNumberField'
import PreferencesMultiSelectField from './PreferencesMultiSelectField'

import './PreferencesForm.scss'

/**
 * Renders the Contact Info form
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
    const { formData } = data
    setFormData(formData)
  }

  const fields = {
    multiSelect: PreferencesMultiSelectField,
    number: PreferencesNumberField,
    radio: PreferencesRadioField
  }

  return (
    <div className="preferences-form">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={onUpdatePreferences}
        onChange={onChange}
        fields={fields}
        liveValidate
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
  preferences: PropTypes.shape({}).isRequired,
  onUpdatePreferences: PropTypes.func.isRequired
}

export default PreferencesForm
