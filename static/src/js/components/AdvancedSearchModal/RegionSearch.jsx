import React from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik } from 'formik'

import RegionSearchForm from './RegionSearchForm'

import './RegionSearch.scss'

/**
 * Renders RegionSearch.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.field - The advanced search field for the.
 * @param {Function} props.handleSearch - Function to handle the search action.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setModalOverlay - Sets the modal overlay content
 * @param {Object} props.values - Form values provided by Formik.
 */
const RegionSearch = ({
  field,
  handleSearch,
  setFieldValue,
  setModalOverlay = null,
  values
}) => {
  const renderSearchResults = () => {
    setModalOverlay('regionSearchResults')
  }

  const onSearchSubmit = (submitValues) => {
    handleSearch(submitValues)

    renderSearchResults()
  }

  const onRemoveSelected = () => {
    setFieldValue('regionSearch.selectedRegion')
    setModalOverlay(null)
  }

  const {
    regionSearch: regionSearchValues = {}
  } = values

  const {
    selectedRegion
  } = regionSearchValues

  const {
    fields
  } = field

  const initialValues = {}
  const validation = {}

  fields.forEach((subfield) => {
    // Grab the initial values from the config
    if (subfield && subfield.value) {
      initialValues[subfield.name] = subfield.value
    }

    // Overrite with the values from the store
    if (regionSearchValues && regionSearchValues[subfield.name]) {
      initialValues[subfield.name] = regionSearchValues[subfield.name]
    }

    // Grab the validation rules
    if (subfield && subfield.validation && subfield.validateFor === field.name) {
      validation[subfield.name] = subfield.validation
    }
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={() => Yup.object().shape(validation)}
      onSubmit={(newValues) => onSearchSubmit(newValues)}
    >
      {
        // eslint-disable-next-line arrow-body-style
        (regionSearchForm) => (
          <RegionSearchForm
            regionSearchForm={regionSearchForm}
            selectedRegion={selectedRegion}
            onRemoveSelected={() => onRemoveSelected()}
          />
        )
      }
    </Formik>
  )
}

RegionSearch.propTypes = {
  field: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    name: PropTypes.string
  }).isRequired,
  handleSearch: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func,
  values: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }).isRequired
}

export default RegionSearch
