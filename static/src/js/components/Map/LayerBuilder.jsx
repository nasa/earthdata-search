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
  console.log('🚀 ~ file: LayerBuilder.jsx:14 ~ projection:', projection)
  console.log('🚀 ~ file: LayerBuilder.jsx:14 ~ format:', format)

  let date = ''
  if (time) {
    const yesterday = moment().subtract(1, 'days')

    date = yesterday.format('YYYY-MM-DD')
  }

  if (projection === 'epsg3413' || projection === 'epsg3031') {
    return (
      <TileLayer
        url={`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${date}/${resolution}/{z}/{y}/{x}.${format}`}
        bounds={
          [
            [-89.9999, -179.9999],
            [89.9999, 179.9999]
          ]
        }
        tileSize={512}
        noWrap
        continuousWorld
        detectRetina
      />
    )
  }

  // https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_GCS_v2/VectorTileServer
  // const basemapStyle = 'arcgis/navigation'
  // Const esriUrl = `https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/beta/${basemapStyle}/static`
  // TODO alternative ep
  const esriUrl = `https://wi.maptiles.arcgis.com/arcgis/rest/services/${product}/MapServer/tile/{z}/{y}/{x}`

  // If we are on web mercanter return an image from ESRI which contains higher zoom levels
  // TODO working ep
  // const esriUrl = 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png'

  // TODO Having the tilesize set was causing issues where I couldnt wrap around the map
  return (
    <TileLayer
      url={esriUrl}
      bounds={
        [
          [-89.9999, -179.9999],
          [89.9999, 179.9999]
        ]
      }
      noWrap
      continuousWorld
      detectRetina
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
