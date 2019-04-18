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

  let date = ''
  if (time) [date] = new Date().toISOString().split('T')

  return (
    <TileLayer
      // eslint-disable-next-line max-len
      url={`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${date}/${projectionResolution}/{z}/{y}/{x}.${format}`}
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
  time: false
}

LayerBuilder.propTypes = {
  projection: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  resolution: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  time: PropTypes.bool
}

export default LayerBuilder
