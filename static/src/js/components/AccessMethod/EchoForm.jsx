import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import EDSCEchoform from '@edsc/echoforms'
import moment from 'moment'
import { isEqual } from 'lodash-es'
import { mbr } from '@edsc/geo-utils'

import './EchoForm.scss'
import '@edsc/echoforms/dist/styles.css'

export const EchoForm = ({
  collectionId,
  form,
  methodKey,
  rawModel,
  shapefileId,
  spatial,
  temporal,
  ursProfile,
  onUpdateAccessMethod
}) => {
  // Get the MBR of the spatial for prepopulated values
  const getMbr = (spatialObject) => {
    const {
      boundingBox = [],
      circle = [],
      point = [],
      polygon = []
    } = spatialObject

    // If there is no spatial, return undefined
    if (!point[0] && !boundingBox[0] && !polygon[0] && !circle[0]) return undefined

    const {
      swLat,
      swLng,
      neLat,
      neLng
    } = mbr({
      boundingBox: boundingBox[0],
      circle: circle[0],
      point: point[0],
      polygon: polygon[0]
    })

    return {
      BBOX_SOUTH: swLat,
      BBOX_WEST: swLng,
      BBOX_NORTH: neLat,
      BBOX_EAST: neLng
    }
  }

  // Format dates in correct format for Echoforms
  const formatDate = (date) => moment.utc(date).format('YYYY-MM-DDTHH:mm:ss')

  // Get the temporal prepopulated values
  const getTemporalPrepopulateValues = (temporalObject) => {
    const {
      endDate,
      startDate
    } = temporalObject

    if (endDate || startDate) {
      return {
        TEMPORAL_START: formatDate(startDate),
        TEMPORAL_END: formatDate(endDate)
      }
    }

    return {
      TEMPORAL_START: '',
      TEMPORAL_END: ''
    }
  }

  const getEmailPrepopulateValues = (ursProfileObject) => {
    const { email_address: emailAddress } = ursProfileObject

    return {
      EMAIL: emailAddress
    }
  }

  const calculatePrepopulateValues = () => {
    const spatialPrepopulateValues = getMbr(spatial)
    const temporalPrepopulateValues = getTemporalPrepopulateValues(temporal)
    const emailPrepopulateValues = getEmailPrepopulateValues(ursProfile)

    const values = {
      ...spatialPrepopulateValues,
      ...temporalPrepopulateValues,
      ...emailPrepopulateValues
    }

    return values
  }

  const [prepopulateValues, setPrepopulateValues] = useState(calculatePrepopulateValues())

  const updateAccessMethod = (data) => {
    onUpdateAccessMethod({
      collectionId,
      method: {
        [methodKey]: {
          ...data
        }
      }
    })
  }

  const onFormModelUpdated = (value) => {
    const {
      hasChanged,
      model,
      rawModel: newRawModel
    } = value

    updateAccessMethod({
      hasChanged,
      model,
      rawModel: newRawModel
    })
  }

  const onFormIsValidUpdated = (valid) => {
    updateAccessMethod({ isValid: valid })
  }

  useEffect(() => {
    const newValues = calculatePrepopulateValues()

    // If the new prepopulate values haven't changed from the previous values, don't update the state
    if (!isEqual(newValues, prepopulateValues)) {
      setPrepopulateValues(newValues)
    }
  }, [spatial, temporal])

  // EDSCEchoforms doesn't care about the shapefileId, just is there a shapefileId or not
  const hasShapefile = !!(shapefileId)

  return (
    <section className="echoform">
      <EDSCEchoform
        addBootstrapClasses
        defaultRawModel={rawModel}
        form={form}
        hasShapefile={hasShapefile}
        prepopulateValues={prepopulateValues}
        onFormModelUpdated={onFormModelUpdated}
        onFormIsValidUpdated={onFormIsValidUpdated}
      />
    </section>
  )
}

EchoForm.defaultProps = {
  rawModel: null,
  shapefileId: null
}

EchoForm.propTypes = {
  collectionId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  methodKey: PropTypes.string.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired,
  rawModel: PropTypes.string,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({
    boundingBox: PropTypes.arrayOf(
      PropTypes.string
    ),
    circle: PropTypes.arrayOf(
      PropTypes.string
    ),
    point: PropTypes.arrayOf(
      PropTypes.string
    ),
    polygon: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired,
  temporal: PropTypes.shape({
    endDate: PropTypes.string,
    startDate: PropTypes.string
  }).isRequired,
  ursProfile: PropTypes.shape({
    email_address: PropTypes.string
  }).isRequired
}

export default EchoForm
