import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { isEqual } from 'lodash-es'

// @ts-expect-error: This file does not have types
import { mbr } from '@edsc/geo-utils'
// @ts-expect-error: This file does not have types
import EDSCEchoform from '@edsc/echoforms'

import './EchoForm.scss'
import '@edsc/echoforms/dist/styles.css'

interface Spatial {
  boundingBox?: string[]
  circle?: string[]
  point?: string[]
  polygon?: string[]
}

interface Temporal {
  endDate?: string
  startDate?: string
}

interface UrsProfile {
  email_address?: string
}

interface EchoFormProps {
  collectionId: string
  form: string
  methodKey: string
  rawModel?: string | null
  shapefileId?: string | null
  spatial: Spatial
  temporal: Temporal
  ursProfile: UrsProfile
  onUpdateAccessMethod: (data: {
    collectionId: string
    method: Record<string, unknown>
  }) => void
}

export const EchoForm: React.FC<EchoFormProps> = ({
  collectionId,
  form,
  methodKey,
  rawModel = null,
  shapefileId = null,
  spatial,
  temporal,
  ursProfile,
  onUpdateAccessMethod
}) => {
  // Get the MBR of the spatial for prepopulated values
  const getMbr = (spatialObject: Spatial) => {
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
  const formatDate = (date?: string) => (date ? moment.utc(date).format('YYYY-MM-DDTHH:mm:ss') : '')

  // Get the temporal prepopulated values
  const getTemporalPrepopulateValues = (temporalObject: Temporal) => {
    const {
      endDate,
      startDate
    } = temporalObject

    return {
      TEMPORAL_START: formatDate(startDate),
      TEMPORAL_END: formatDate(endDate)
    }
  }

  const getEmailPrepopulateValues = (ursProfileObject: UrsProfile) => {
    const { email_address: emailAddress } = ursProfileObject

    return {
      EMAIL: emailAddress || ''
    }
  }

  const calculatePrepopulateValues = () => {
    const spatialPrepopulateValues = getMbr(spatial)
    const temporalPrepopulateValues = getTemporalPrepopulateValues(temporal)
    const emailPrepopulateValues = getEmailPrepopulateValues(ursProfile)

    return {
      ...spatialPrepopulateValues,
      ...temporalPrepopulateValues,
      ...emailPrepopulateValues
    }
  }

  const [prepopulateValues, setPrepopulateValues] = useState(calculatePrepopulateValues())

  const updateAccessMethod = (data: Record<string, unknown>) => {
    onUpdateAccessMethod({
      collectionId,
      method: {
        [methodKey]: {
          ...data
        }
      }
    })
  }

  const onFormModelUpdated = (value: { hasChanged: boolean, model: unknown, rawModel: string }) => {
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

  const onFormIsValidUpdated = (valid: boolean) => {
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
  const hasShapefile = !!shapefileId

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

export default EchoForm
