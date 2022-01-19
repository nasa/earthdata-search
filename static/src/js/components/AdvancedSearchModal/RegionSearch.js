import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik } from 'formik'

import RegionSearchForm from './RegionSearchForm'

import './RegionSearch.scss'

/**
 * Renders RegionSearch.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.field - The advanced search field for the.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Object} props.regionSearchResults - The current region search results.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 * @param {Function} props.onChangeRegionQuery - Callback function to update the region search results.
 */
export class RegionSearch extends Component {
  onSearchSubmit(values) {
    const {
      onChangeRegionQuery
    } = this.props

    const {
      keyword,
      endpoint,
      exact = false
    } = values

    onChangeRegionQuery({
      exact,
      endpoint,
      keyword
    }, this.renderSearchResults())
  }

  onRemoveSelected() {
    const {
      setFieldValue,
      setModalOverlay
    } = this.props

    setFieldValue('regionSearch.selectedRegion')
    setModalOverlay(null)
  }

  renderSearchResults() {
    const {
      setModalOverlay
    } = this.props

    setModalOverlay('regionSearchResults')
  }

  render() {
    const {
      field,
      values
    } = this.props

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

      // Overrite with the values from Redux
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
        onSubmit={(values) => this.onSearchSubmit(values)}
      >
        {
          // eslint-disable-next-line arrow-body-style
          (regionSearchForm) => (
            <RegionSearchForm
              regionSearchForm={regionSearchForm}
              selectedRegion={selectedRegion}
              onRemoveSelected={() => this.onRemoveSelected()}
            />
          )
        }
      </Formik>
    )
  }
}

RegionSearch.defaultProps = {
  setModalOverlay: null
}

RegionSearch.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    name: PropTypes.string
  }).isRequired,
  onChangeRegionQuery: PropTypes.func.isRequired,
  regionSearchResults: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }).isRequired
}

export default RegionSearch
