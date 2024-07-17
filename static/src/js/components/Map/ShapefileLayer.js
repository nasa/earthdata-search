import { createLayerComponent } from '@react-leaflet/core'

import { ShapefileLayerExtended } from './ShapefileLayerExtended'

import './ShapefileLayer.scss'

const createLayer = (props, context) => {
  const layer = new ShapefileLayerExtended(props)

  return {
    instance: layer,
    context
  }
}

const updateLayer = (instance, props) => {
  const {
    isProjectPage,
    shapefile = {},
    onFetchShapefile
  } = props

  // eslint-disable-next-line no-param-reassign
  instance.isProjectPage = isProjectPage

  const {
    file: toFile,
    isLoading,
    shapefileId: toShapefileId,
    shapefileName,
    selectedFeatures
  } = shapefile

  if (toShapefileId && !toFile && !isLoading) {
    onFetchShapefile(toShapefileId)
  }

  if (toFile) {
    instance.drawNewShapefile(toFile, selectedFeatures)
  }

  if (!toShapefileId && !shapefileName) {
    instance.onRemovedFile()
  }
}

export default createLayerComponent(createLayer, updateLayer)
