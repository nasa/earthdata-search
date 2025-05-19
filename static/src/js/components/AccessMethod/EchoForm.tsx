import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { isEqual } from 'lodash-es'
// @ts-expect-error: This file does not have types
import EDSCEchoform from '@edsc/echoforms'

// @ts-expect-error: This file does not have types
import { mbr } from '@edsc/geo-utils'

import useEdscStore from '../../zustand/useEdscStore'
import {
  Spatial,
  Temporal,
  UrsProfile
} from '../../types/sharedTypes'

import './EchoForm.scss'
import '@edsc/echoforms/dist/styles.css'

export interface EchoFormProps {
  /** The collection ID */
  collectionId: string
  /** The form xml */
  form: string
  /** The access method key */
  methodKey: string
  /** The raw EchoForms model */
  rawModel?: string | null
  /** The spatial object, if applied */
  spatial: Spatial
  /** The temporal object, if applied */
  temporal: Temporal
  /** The URS profile for the user */
  ursProfile: UrsProfile
  /** A callback called when the access method is updated */
  onUpdateAccessMethod: (data: {
    collectionId: string
    method: Record<string, unknown>
  }) => void
}

/** The arguments for the updateAccessMethod function */
type UpdateAccessMethodArgs = Record<string, unknown>

/** The arguments for the onFormModelUpdated function */
type OnFormModelUpdatedArgs = {
  hasChanged: boolean,
  model: unknown,
  rawModel: string
}

/** The arguments for the onFormIsValid function */
type OnFormIsValidUpdatedArgs = boolean

/** The arguments for the formatDate function */
type FormatDateArgs = Temporal['startDate'] | Temporal['endDate']

export const EchoForm: React.FC<EchoFormProps> = ({
  collectionId,
  form,
  methodKey,
  rawModel = null,
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
  const formatDate = (date: FormatDateArgs) => (date ? moment.utc(date).format('YYYY-MM-DDTHH:mm:ss') : '')

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
      EMAIL: emailAddress
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

  const updateAccessMethod = (data: UpdateAccessMethodArgs) => {
    onUpdateAccessMethod({
      collectionId,
      method: {
        [methodKey]: {
          ...data
        }
      }
    })
  }

  const onFormModelUpdated = (value: OnFormModelUpdatedArgs) => {
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

  const onFormIsValidUpdated = (valid: OnFormIsValidUpdatedArgs) => {
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
  const shapefileId = useEdscStore((state) => state.shapefile.shapefileId)
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
