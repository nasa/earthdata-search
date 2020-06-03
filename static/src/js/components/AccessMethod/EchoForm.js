import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import EDSCEchoform from '@edsc/echoforms'

import { mbr } from '../../util/map/mbr'
import { insertRawModelIntoEchoForm } from '../../util/insertRawModelIntoEchoForm'

export const EchoForm = ({
  collectionId,
  form,
  methodKey,
  rawModel: propsRawModel,
  shapefileId,
  spatial,
  onUpdateAccessMethod
}) => {
  const echoForm = useRef(form)
  const [rawModel, setRawModel] = useState('')
  const [model, setModel] = useState('')
  const [isValid, setIsValid] = useState(true)

  const onFormModelUpdated = (value) => {
    const { model: newModel, rawModel: newRawModel } = value
    setModel(newModel)
    setRawModel(newRawModel)
  }

  const onFormIsValidUpdated = (valid) => {
    setIsValid(valid)
  }

  const getMbr = (spatial) => {
    // if there is no spatial, return undefined
    if (!spatial) return undefined
    const { point, boundingBox, polygon } = spatial
    if (!point && !boundingBox && !polygon) return undefined

    const [south, west, north, east] = mbr(spatial)

    return {
      BBOX_SOUTH: south,
      BBOX_WEST: west,
      BBOX_NORTH: north,
      BBOX_EAST: east
    }
  }

  useEffect(() => {
    echoForm.current = insertRawModelIntoEchoForm(propsRawModel, form)
  }, [])

  useEffect(() => {
    onUpdateAccessMethod({
      collectionId,
      method: {
        [methodKey]: {
          isValid,
          model,
          rawModel
        }
      }
    })
  }, [model, rawModel, isValid])

  const spatialMbr = getMbr(spatial)

  return (
    <section className="echoform">
      <EDSCEchoform
        key={methodKey}
        addBootstrapClasses
        form={echoForm.current}
        hasShapefile={shapefileId != null}
        prepopulateValues={spatialMbr}
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
  rawModel: PropTypes.string,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired
}

export default EchoForm
