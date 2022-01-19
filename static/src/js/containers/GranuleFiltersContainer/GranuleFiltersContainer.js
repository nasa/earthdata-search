import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'

import actions from '../../actions'

import validationSchema from './validationSchema'
import mapPropsToValues from './mapPropsToValues'
import handleFormSubmit from './handleFormSubmit'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleFiltersForm
  from '../../components/GranuleFilters/GranuleFiltersForm'

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
    (collectionId) => dispatch(actions.undoExcludeGranule(collectionId))
})

/**
 * Renders GranuleFiltersContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collections - The collections.
 * @param {Boolean} props.dirty - Flag from Formik set true if the form has been changed since the last submit.
 * @param {Boolean} props.granuleFiltersNeedsReset - Flag to trigger a form reset.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {String} props.focusedCollection - The focused collection id.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Object} props.metadata - The focused collection metadata.
 * @param {Function} props.onApplyGranuleFilters - Callback function to apply the granule filters.
 * @param {Function} props.onClearGranuleFilters - Callback function to clear the granule filters.
 * @param {Function} props.setGranuleFiltersNeedReset - Callback to reset the granuleFiltersNeedsReset flag.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.temporal - The query temporal.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */

export class GranuleFiltersContainer extends Component {
  constructor(props) {
    super(props)
    this.form = null
    this.onClearGranuleFilters = this.onClearGranuleFilters.bind(this)
    this.onHandleSubmit = this.onHandleSubmit.bind(this)
  }

  componentDidUpdate() {
    const {
      granuleFiltersNeedsReset,
      setGranuleFiltersNeedReset
    } = this.props

    if (granuleFiltersNeedsReset) {
      this.onClearGranuleFilters()
      setGranuleFiltersNeedReset(false)
    }
  }

  onHandleSubmit() {
    // Wait until Formik has changed the values internally with setTimeout
    setTimeout(() => {
      const {
        dirty,
        values,
        handleSubmit
      } = this.props

      // Only submit the form if its values have changed
      if (dirty) handleSubmit(values)
    }, 0)
  }

  onClearGranuleFilters() {
    const {
      onClearGranuleFilters,
      handleReset
    } = this.props

    handleReset()
    onClearGranuleFilters()
  }

  render() {
    const {
      collectionMetadata,
      errors,
      granuleQuery,
      handleBlur,
      handleChange,
      setFieldTouched,
      setFieldValue,
      onUndoExcludeGranule,
      touched,
      values
    } = this.props

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
        handleSubmit={this.onHandleSubmit}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        excludedGranuleIds={excludedGranuleIds}
        onUndoExcludeGranule={onUndoExcludeGranule}
      />
    )
  }
}

const EnhancedGranuleFiltersContainer = withFormik({
  enableReinitialize: true,
  validationSchema,
  mapPropsToValues,
  handleSubmit: handleFormSubmit
})(GranuleFiltersContainer)

GranuleFiltersContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  dirty: PropTypes.bool.isRequired,
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
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setGranuleFiltersNeedReset: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedGranuleFiltersContainer)
