import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'moment'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import SecondaryOverlayPanelContainer
  from '../SecondaryOverlayPanelContainer/SecondaryOverlayPanelContainer'
import GranuleFiltersHeaderContainer
  from '../GranuleFiltersHeaderContainer/GranuleFiltersHeaderContainer'
import GranuleFiltersActions
  from '../../components/GranuleFilters/GranuleFiltersActions'
import GranuleFiltersBody
  from '../../components/GranuleFilters/GranuleFiltersBody'
import GranuleFiltersForm
  from '../../components/GranuleFilters/GranuleFiltersForm'

import actions from '../../actions'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})

const mapDispatchToProps = dispatch => ({
  onApplyGranuleFilters:
    (focusedCollection, values) => dispatch(actions.applyGranuleFilters(focusedCollection, values)),
  onGetGranules:
    () => dispatch(actions.getGranules()),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUpdateCollectionGranuleFilters:
    (id, granuleFilters) => dispatch(actions.updateCollectionGranuleFilters(id, granuleFilters)),
  onUpdateGranuleQuery:
    state => dispatch(actions.updateGranuleQuery(state))
})

export class GranuleFiltersPanelContainer extends Component {
  constructor(props) {
    super(props)
    this.form = null
    this.onClearGranuleFilters = this.onClearGranuleFilters.bind(this)
  }

  onClearGranuleFilters() {
    const {
      onApplyGranuleFilters,
      focusedCollection,
      handleReset
    } = this.props

    handleReset()
    onApplyGranuleFilters(focusedCollection, {})
  }

  render() {
    const {
      collections,
      errors,
      focusedCollection,
      handleBlur,
      handleChange,
      handleSubmit,
      isValid,
      setFieldValue,
      setFieldTouched,
      touched,
      values
    } = this.props

    const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

    if (Object.keys(focusedCollectionMetadata).length === 0) return null

    const { metadata } = focusedCollectionMetadata[focusedCollection]

    return (
      <SecondaryOverlayPanelContainer
        header={<GranuleFiltersHeaderContainer />}
        body={(
          <GranuleFiltersBody
            granuleFiltersForm={(
              <GranuleFiltersForm
                metadata={metadata}
                values={values}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
            )}
          />
        )}
        footer={(
          <GranuleFiltersActions
            isValid={isValid}
            onApplyClick={handleSubmit}
            onClearClick={this.onClearGranuleFilters}
          />
        )}
      />
    )
  }
}

const ValidationSchema = () => {
  const dateFormat = 'YYYY-MM-DDTHH:m:s.SSSZ'
  const errors = {
    cloudCover: {
      invalidNumber: 'Enter a valid number',
      minMax: 'Value must be between 0.0 and 100.0',
      // eslint-disable-next-line no-template-curly-in-string
      minLessThanMax: '${path} should be less than Maximum',
      // eslint-disable-next-line no-template-curly-in-string
      maxGreaterThanMin: '${path} should be greater Minimum'
    },
    temporal: {
      invalidStartDate: 'Enter a valid start date',
      invalidEndDate: 'Enter a valid end date'
    }
  }

  const nullableValue = (value, originalValue) => (originalValue.trim() === '' ? null : value)

  function minLessThanMax(value) {
    const min = value
    const max = this.resolve(Yup.ref('max'))

    // If there is no max
    if (min && !max) return true

    // If the value is not set, dont check
    if (min === null) return true
    return min <= max
  }

  function maxLessThanMin(value) {
    const max = value
    const min = this.resolve(Yup.ref('min'))
    if (max && !min) return true
    if (max === null) return true
    return max >= min
  }

  function startBeforeEnd(value) {
    const endDate = this.resolve(Yup.ref('endDate'))
    const momentEndVal = Moment(endDate, dateFormat, true)
    const momentStartVal = Moment(value, dateFormat, true)
    if (momentStartVal && !endDate) return true
    return momentStartVal.isBefore(momentEndVal)
  }

  return Yup.object().shape({
    cloudCover: Yup.object().shape({
      min: Yup.number()
        .label('Minimum')
        .typeError(errors.cloudCover.invalidNumber)
        .test('min-less-than-max', errors.cloudCover.minLessThanMax, minLessThanMax)
        .min(0, errors.cloudCover.minMax)
        .max(100, errors.cloudCover.minMax)
        .transform(nullableValue)
        .nullable(),
      max: Yup.number()
        .label('Maximum')
        .typeError(errors.cloudCover.invalidNumber)
        // eslint-disable-next-line no-template-curly-in-string
        .test('max-less-than-min', errors.cloudCover.maxGreaterThanMin, maxLessThanMin)
        .min(0, errors.cloudCover.minMax)
        .max(100, errors.cloudCover.minMax)
        .transform(nullableValue)
        .nullable()
    }),
    temporal: Yup.object().shape({
      startDate: Yup.date()
        .label('Start')
        .typeError(errors.temporal.invalidStartDate)
        .transform((value, originalValue) => {
          const momentVal = Moment(originalValue, dateFormat, true)
          return momentVal.isValid() ? momentVal.toDate() : null
        })
        .nullable()
        // eslint-disable-next-line no-template-curly-in-string
        .test('start-before-end', '${path} should be before End', startBeforeEnd),
      endDate: Yup.date()
        .typeError(errors.temporal.invalidEndDate)
        .transform((value, originalValue) => {
          const momentVal = Moment(originalValue, dateFormat, true)
          return momentVal.isValid() ? momentVal.toDate() : null
        })
        .nullable()
    })
  })
}

const EnhancedGranuleFiltersPanelContainer = withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues: (props) => {
    const {
      collections,
      focusedCollection
    } = props
    const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

    if (Object.keys(focusedCollectionMetadata).length === 0) return {}

    const { granuleFilters } = focusedCollectionMetadata[focusedCollection]

    const {
      dayNightFlag = '',
      browseOnly = false,
      onlineOnly = false,
      cloudCover = {},
      temporal = {}
    } = granuleFilters

    const {
      min: cloudCoverMin,
      max: cloudCoverMax
    } = cloudCover

    const {
      startDate: temporalStartDate,
      endDate: temporalEndDate
    } = temporal

    return {
      dayNightFlag: dayNightFlag || '',
      browseOnly: browseOnly || false,
      onlineOnly: onlineOnly || false,
      cloudCover: {
        min: cloudCoverMin || '',
        max: cloudCoverMax || ''
      },
      temporal: {
        startDate: temporalStartDate || '',
        endDate: temporalEndDate || ''
      }
    }
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    const {
      focusedCollection,
      onApplyGranuleFilters
    } = props

    onApplyGranuleFilters(focusedCollection, values, true)
    setSubmitting(false)
  }
})(GranuleFiltersPanelContainer)

GranuleFiltersPanelContainer.propTypes = {
  values: PropTypes.shape({}).isRequired,
  touched: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedGranuleFiltersPanelContainer)
