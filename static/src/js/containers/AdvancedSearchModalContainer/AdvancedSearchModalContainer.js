import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'

import actions from '../../actions'
import {
  getValidationSchema
} from '../../util/forms'

import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal'

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  isOpen: state.ui.advancedSearchModal.isOpen,
  regionSearchResults: state.searchResults.regions
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleAdvancedSearchModal:
    (state) => dispatch(actions.toggleAdvancedSearchModal(state)),
  onChangeRegionQuery:
    (query) => dispatch(actions.changeRegionQuery(query)),
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query))
})

/**
 * Renders AdvancedSearchModalContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.advancedSearch - The collections.
 * @param {Boolean} props.isOpen - The modal state.
 * @param {Object} props.fields - The advanced search fields.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Boolean} props.isValid - Flag provided from Formik.
 * @param {Function} props.onToggleAdvancedSearchModal - Callback function close the modal.
 * @param {Function} props.onChangeRegionQuery - Callback function to update the region search results.
 * @param {Function} props.onChangeQuery - Callback function to update the search results.
 * @param {Function} props.resetForm - Callback function provided by Formik.
 * @param {Object} props.regionSearchResults - The current region search results.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export const AdvancedSearchModalContainer = ({
  advancedSearch,
  isOpen,
  fields,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isValid,
  onChangeRegionQuery,
  onChangeQuery,
  onToggleAdvancedSearchModal,
  resetForm,
  regionSearchResults,
  setFieldValue,
  setFieldTouched,
  touched,
  values,
  validateForm
}) => (
  <AdvancedSearchModal
    advancedSearch={advancedSearch}
    isOpen={isOpen}
    fields={fields}
    onChangeRegionQuery={onChangeRegionQuery}
    onChangeQuery={onChangeQuery}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
    errors={errors}
    handleBlur={handleBlur}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    isValid={isValid}
    resetForm={resetForm}
    regionSearchResults={regionSearchResults}
    setFieldValue={setFieldValue}
    setFieldTouched={setFieldTouched}
    touched={touched}
    values={values}
    validateForm={validateForm}
  />
)

const EnhancedAdvancedSearchModalContainer = withFormik({
  enableReinitialize: true,
  validationSchema: (props) => {
    const { fields } = props
    return getValidationSchema(fields, 'advancedSearch')
  },
  mapPropsToValues: (props) => {
    const {
      advancedSearch
    } = props

    return advancedSearch
  },
  handleSubmit: (values, { props }) => {
    const {
      onUpdateAdvancedSearch,
      onChangeQuery
    } = props

    onUpdateAdvancedSearch(values)
    onChangeQuery({
      collection: {
        spatial: {}
      }
    })
  }
})(AdvancedSearchModalContainer)

AdvancedSearchModalContainer.propTypes = {
  advancedSearch: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  regionSearchResults: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  validateForm: PropTypes.func.isRequired,
  onChangeRegionQuery: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedAdvancedSearchModalContainer)
