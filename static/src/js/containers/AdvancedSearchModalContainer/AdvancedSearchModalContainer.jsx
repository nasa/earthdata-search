import React from 'react'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import { splitListOfPoints } from '@edsc/geo-utils'
import { LineString, Polygon } from 'ol/geom'

import { getValidationSchema } from '../../util/forms'

import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal'

import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getSelectedRegionQuery } from '../../zustand/selectors/query'

/**
 * Renders AdvancedSearchModalContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.fields - The advanced search fields.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.handleSubmit - Callback function provided by Formik.
 * @param {Boolean} props.isValid - Flag provided from Formik.
 * @param {Function} props.resetForm - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 * @param {Function} props.validateForm - Callback function provided by Formik.
 */
export const AdvancedSearchModalContainer = ({
  fields,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isValid,
  resetForm,
  setFieldValue,
  setFieldTouched,
  touched,
  values,
  validateForm
}) => (
  <AdvancedSearchModal
    fields={fields}
    errors={errors}
    handleBlur={handleBlur}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    isValid={isValid}
    resetForm={resetForm}
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
      selectedRegion
    } = props

    return selectedRegion
  },
  handleSubmit: (values) => {
    // Move the map to the extent of the new search
    const { regionSearch = {} } = values
    const { selectedRegion = {} } = regionSearch
    const {
      spatial: regionSpatial,
      type
    } = selectedRegion
    const points = splitListOfPoints(regionSpatial)

    let shape
    let coordinates
    if (type === 'reach') {
      const lineCoordinates = points.map((point) => {
        const [lng, lat] = point.split(',')

        return [parseFloat(lng), parseFloat(lat)]
      })

      shape = new LineString(lineCoordinates)

      // CMR has a limit of 500 points in a line spatial query.
      // If there are more than 500 points, simplify the shape
      if (lineCoordinates.length > 500) {
        shape = shape.simplify(0.001)
      }

      // Get the coordinates of the shape to save to the store
      coordinates = shape.getFlatCoordinates().join(',')
    } else {
      const polygonCoordinates = points.map((point) => {
        const [lng, lat] = point.split(',')

        return [parseFloat(lng), parseFloat(lat)]
      })

      shape = new Polygon([polygonCoordinates])

      // Get the coordinates of the shape to save to the store
      coordinates = shape.getFlatCoordinates().join(',')
    }

    const { changeQuery } = useEdscStore.getState().query
    changeQuery({
      collection: {
        spatial: {}
      },
      selectedRegion: {
        ...values.regionSearch.selectedRegion,
        spatial: coordinates
      }
    })

    // Move the map
    eventEmitter.emit(mapEventTypes.MOVEMAP, { shape })
  }
})(AdvancedSearchModalContainer)

// `withFormik` uses props passed in to it in order to populate data in `handleFormSubmit`.
// `handleFormSubmit` needs access to selectedRegion from Zustand, which is not available
// in props after removing it from `mapStateToProps`. This wrapper component uses the `useEdscStore`
// hook to fetch the collection metadata, then pass it into the `EnhancedAdvancedSearchModalContainer`.
const AdvancedSearchModalContainerWrapper = (props) => {
  const selectedRegion = useEdscStore(getSelectedRegionQuery)

  return (
    <EnhancedAdvancedSearchModalContainer
      {...props}
      selectedRegion={selectedRegion}
    />
  )
}

AdvancedSearchModalContainer.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  validateForm: PropTypes.func.isRequired
}

export default AdvancedSearchModalContainerWrapper
