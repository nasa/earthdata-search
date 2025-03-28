import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'
import Form from 'react-bootstrap/Form'

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

    const { items, title } = schema
    console.log('🚀 ~ file: PreferencesMultiSelectField.jsx:46 ~ PreferencesMultiSelectField ~ title:', title)
    const {
      enum: values,
      enumNames,
      description
    } = items
    console.log('🚀 ~ file: PreferencesMultiSelectField.jsx:52 ~ PreferencesMultiSelectField ~ title:', title)
    // let parsedFormData = formData

    // TODO EDSC-4443: remove this in a subsequent release
    // if (title === 'Overlay Layers') {
    //   // Remove blueMarble element from rendering a radio button
    //   const referenceFeatureIndex = values.indexOf('referenceFeatures')
    //   const referenceLabelsIndex = values.indexOf('referenceLabels')

    //   // Remove "referenceLabels" if it exists in the array
    //   if (referenceFeatureIndex !== -1) {
    //     values.splice(referenceFeatureIndex, 1)
    //   }

    //   // Remove "referenceLabels" if it exists in the array
    //   if (referenceLabelsIndex !== -1) {
    //     values.splice(referenceLabelsIndex, 1)
    //   }

    //   // TODO make sure we use the constants for this
    //   if (parsedFormData === 'referenceFeatures') {
    //     parsedFormData = 'bordersRoads'
    //   }

    //   if (parsedFormData === 'referenceLabels') {
    //     parsedFormData = 'placeLabels'
    //   }
    // }

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
      enum: PropTypes.arrayOf(PropTypes.string),
      enumNames: PropTypes.arrayOf(PropTypes.string),
      description: PropTypes.string
    }),
    title: PropTypes.string
  }).isRequired
}

export default PreferencesMultiSelectField
