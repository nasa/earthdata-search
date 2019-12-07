import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import actions from '../../actions'

import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal'

const mapStateToProps = state => ({
  isOpen: state.ui.advancedSearchModal.isOpen
})

const mapDispatchToProps = dispatch => ({
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

export const AdvancedSearchModalContainer = ({
  isOpen,
  onToggleAdvancedSearchModal,
  fields,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isValid,
  setFieldValue,
  setFieldTouched,
  touched,
  values
}) => (
  <AdvancedSearchModal
    isOpen={isOpen}
    fields={fields}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
    errors={errors}
    handleBlur={handleBlur}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    isValid={isValid}
    setFieldValue={setFieldValue}
    setFieldTouched={setFieldTouched}
    touched={touched}
    values={values}
  />
)

// Build an object containing Yup validation for each of the fields
const getValidationSchema = (fields) => {
  const validation = {}

  fields.forEach((field) => {
    if (!validation[field.validation]) {
      validation[field.name] = field.validation
    }
  })

  return Yup.object().shape(validation)
}

// Build an object containing initial values for each of the fields
const getIntitalValues = (fields, advancedSearch) => {
  const initialValues = {}

  fields.forEach((field) => {
    if (!initialValues[field.name]) {
      initialValues[field.name] = advancedSearch[field.name] || field.value
    }
  })

  return initialValues
}

const EnhancedAdvancedSearchModalContainer = withFormik({
  enableReinitialize: true,
  validationSchema: (props) => {
    const { fields } = props
    return getValidationSchema(fields)
  },
  mapPropsToValues: (props) => {
    const {
      advancedSearch,
      fields
    } = props
    return getIntitalValues(fields, advancedSearch)
  },
  handleSubmit: (values, { props }) => {
    const {
      onUpdateAdvancedSearch
    } = props

    onUpdateAdvancedSearch(values)
  }
})(AdvancedSearchModalContainer)

AdvancedSearchModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedAdvancedSearchModalContainer)
