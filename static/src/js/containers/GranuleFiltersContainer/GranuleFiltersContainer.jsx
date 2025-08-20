import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'

import validationSchema from './validationSchema'
import mapPropsToValues from './mapPropsToValues'
import handleFormSubmit from './handleFormSubmit'

import GranuleFiltersForm from '../../components/GranuleFilters/GranuleFiltersForm'
import { metricsGranuleFilter } from '../../middleware/metrics/actions'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId } from '../../zustand/selectors/collection'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsGranuleFilter:
    (data) => dispatch(metricsGranuleFilter(data))
})

/**
 * Renders GranuleFiltersContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Boolean} props.granuleFiltersNeedsReset - Flag to trigger a form reset.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleReset - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Function} props.onMetricsGranuleFilter - Callback function to send metrics for the granule filters.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setGranuleFiltersNeedReset - Callback to reset the granuleFiltersNeedsReset flag.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export const GranuleFiltersContainer = (props) => {
  const {
    errors,
    granuleFiltersNeedsReset,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    onMetricsGranuleFilter,
    setFieldTouched,
    setFieldValue,
    setGranuleFiltersNeedReset,
    touched,
    values
  } = props

  const collectionId = useEdscStore(getCollectionId)
  const changeGranuleQuery = useEdscStore((state) => state.query.changeGranuleQuery)

  const onClearGranuleFilters = () => {
    handleReset()

    changeGranuleQuery({
      collectionId,
      query: {}
    })
  }

  useEffect(() => {
    if (granuleFiltersNeedsReset) {
      onClearGranuleFilters()
      setGranuleFiltersNeedReset(false)
    }
  }, [granuleFiltersNeedsReset])

  const onHandleSubmit = () => {
    // Pass the internal `Formik` values
    // Waits for the next event cycle to execute
    // Allows validation for temporal selection to work as expected
    setTimeout(() => {
      handleSubmit(values)
    }, 0)
  }

  return (
    <GranuleFiltersForm
      values={values}
      touched={touched}
      errors={errors}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={onHandleSubmit}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      onMetricsGranuleFilter={onMetricsGranuleFilter}
    />
  )
}

const EnhancedGranuleFiltersContainer = withFormik({
  enableReinitialize: true,
  validationSchema,
  mapPropsToValues,
  handleSubmit: handleFormSubmit
})(GranuleFiltersContainer)

GranuleFiltersContainer.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  granuleFiltersNeedsReset: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onMetricsGranuleFilter: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setGranuleFiltersNeedReset: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default connect(null, mapDispatchToProps)(EnhancedGranuleFiltersContainer)
