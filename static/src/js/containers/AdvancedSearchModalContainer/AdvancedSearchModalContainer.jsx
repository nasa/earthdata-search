import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import { splitListOfPoints } from '@edsc/geo-utils'
import { LineString, Polygon } from 'ol/geom'

import actions from '../../actions'
import { getValidationSchema } from '../../util/forms'

import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal'

import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'
import useEdscStore from '../../zustand/useEdscStore'

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  isOpen: state.ui.advancedSearchModal.isOpen,
  regionSearchResults: state.searchResults.regions
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleAdvancedSearchModal:
    (state) => dispatch(actions.toggleAdvancedSearchModal(state))
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
      onUpdateAdvancedSearch
    } = props

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

      // Get the coordinates of the shape to save to the redux state
      coordinates = shape.getFlatCoordinates().join(',')
    } else {
      const polygonCoordinates = points.map((point) => {
        const [lng, lat] = point.split(',')

        return [parseFloat(lng), parseFloat(lat)]
      })

      shape = new Polygon([polygonCoordinates])

      // Get the coordinates of the shape to save to the redux state
      coordinates = shape.getFlatCoordinates().join(',')
    }

    onUpdateAdvancedSearch({
      ...values,
      regionSearch: {
        ...values.regionSearch,
        selectedRegion: {
          ...values.regionSearch.selectedRegion,
          spatial: coordinates
        }
      }
    })

    const { changeQuery } = useEdscStore.getState().query
    changeQuery({
      collection: {
        spatial: {}
      }
    })

    // Move the map
    eventEmitter.emit(mapEventTypes.MOVEMAP, { shape })
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
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedAdvancedSearchModalContainer)
