import React from 'react'
import PropTypes from 'prop-types'
import { TileLayer } from 'react-leaflet'
import moment from 'moment'

const LayerBuilder = (props) => {
  const {
    projection,
    product,
    resolution,
    format,
    time
  } = props

  let date = ''
  if (time) {
    const yesterday = moment().subtract(1, 'days')

    date = yesterday.format('YYYY-MM-DD')
  }

  return (
    <TileLayer
      url={`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${date}/${resolution}/{z}/{y}/{x}.${format}`}
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
