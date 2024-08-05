import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'

import actions from '../../actions'

import validationSchema from './validationSchema'
import mapPropsToValues from './mapPropsToValues'
import handleFormSubmit from './handleFormSubmit'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleFiltersForm from '../../components/GranuleFilters/GranuleFiltersForm'
import { metricsGranuleFilter } from '../../middleware/metrics/actions'

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  temporal: state.query.collection.temporal
})

export const mapDispatchToProps = (dispatch) => ({
  onApplyGranuleFilters:
    (values, closePanel) => dispatch(
      actions.applyGranuleFilters(values, closePanel)
    ),
  onClearGranuleFilters: (collectionId) => dispatch(
    actions.clearGranuleFilters(collectionId)
  ),
  onUndoExcludeGranule:
    (collectionId) => dispatch(actions.undoExcludeGranule(collectionId)),
  onMetricsGranuleFilter:
    (data) => dispatch(metricsGranuleFilter(data))
})

/**
 * Renders GranuleFiltersContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collectionMetadata - The focused collections metadata.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Boolean} props.granuleFiltersNeedsReset - Flag to trigger a form reset.
 * @param {Object} props.granuleQuery - Granule query state
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleReset - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Function} props.onClearGranuleFilters - Callback function to clear the granule filters.
 * @param {Function} props.onApplyGranuleFilters - Callback function to apply the granule filters.
 * @param {Function} props.onMetricsGranuleFilter - Callback function to send metrics for the granule filters.
 * @param {Function} props.onUndoExcludeGranule - Callback function to undo the granule filters.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setGranuleFiltersNeedReset - Callback to reset the granuleFiltersNeedsReset flag.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.temporal - The query temporal.
 * @param {Object} props.values - Form values provided by Formik.
 */

export const GranuleFiltersContainer = (props) => {
  const {
    collectionMetadata,
    errors,
    granuleFiltersNeedsReset,
    granuleQuery,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    onClearGranuleFilters: onClearGranuleFiltersProp,
    onMetricsGranuleFilter,
    onUndoExcludeGranule,
    setFieldTouched,
    setFieldValue,
    setGranuleFiltersNeedReset,
    touched,
    values
  } = props

  const onClearGranuleFilters = () => {
    handleReset()
    onClearGranuleFiltersProp()
  }

  useEffect(() => {
    if (granuleFiltersNeedsReset) {
      onClearGranuleFilters()
      setGranuleFiltersNeedReset(false)
    }
  }, [granuleFiltersNeedsReset])

  const onHandleSubmit = () => {
    // Pass the internal `Formik` values
    handleSubmit(values)
  }

  const {
    excludedGranuleIds = []
  } = granuleQuery

  return (
    <GranuleFiltersForm
      collectionMetadata={collectionMetadata}
      values={values}
      touched={touched}
      errors={errors}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={onHandleSubmit}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      excludedGranuleIds={excludedGranuleIds}
      onMetricsGranuleFilter={onMetricsGranuleFilter}
      onUndoExcludeGranule={onUndoExcludeGranule}
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
  collectionMetadata: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  granuleFiltersNeedsReset: PropTypes.bool.isRequired,
  granuleQuery: PropTypes.shape({
    excludedGranuleIds: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClearGranuleFilters: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  onMetricsGranuleFilter: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setGranuleFiltersNeedReset: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedGranuleFiltersContainer)
