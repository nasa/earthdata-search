import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import LayerGroup from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

const bordersRoads = ({
  attributions
}) => {
  const bordersLayer = new VectorLayer({
    source: new VectorSource({
      url: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
      format: new GeoJSON(),
      attributions,
      wrapX: false
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#8A8A8A',
        width: 1
      })
    }),
    className: 'edsc-borders-vector-layer'
  })

  const roadsLayer = new TileLayer({
    source: new XYZ({
      attributions,
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 16,
      projection: 'EPSG:3857'
    }),
    className: 'edsc-roads-layer'
  })

  // Combine into a layer group
  const bordersRoadsGroup = new LayerGroup({
    layers: [bordersLayer, roadsLayer],
    className: 'edsc-borders-roads-vector-group',
    visible: false
  })

  return bordersRoadsGroup
}

export default bordersRoads
