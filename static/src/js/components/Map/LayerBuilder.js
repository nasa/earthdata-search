import React from 'react'
import PropTypes from 'prop-types'
import { TileLayer } from 'react-leaflet'

const LayerBuilder = (props) => {
  const {
    projection,
    product,
    resolution,
    format,
    time
  } = props

  const projectionResolution = `${projection.toUpperCase()}_${resolution}`

  return (
    <TileLayer
      url={`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${time}/${projectionResolution}/{z}/{y}/{x}.${format}`}
      bounds={[
        [-89.9999, -179.9999],
        [89.9999, 179.9999]
      ]}
      tileSize={512}
      noWrap
      continuousWorld
    />
  )
}

LayerBuilder.defaultProps = {
  time: ''
}

LayerBuilder.propTypes = {
  projection: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  resolution: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  time: PropTypes.string
}

export default LayerBuilder
