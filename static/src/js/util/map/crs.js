import L from 'leaflet'
import proj4 from 'proj4'
import 'proj4leaflet'

const ScaledLonLatProjection = (scale) => ({
  project: (latlng) => (
    new L.Point(latlng.lng * scale, latlng.lat * scale)
  ),
  unproject: (point) => (
    new L.LatLng(point.y / scale, point.x / scale)
  ),
  bounds: L.bounds([-180 * scale, -90 * scale], [180 * scale, 90 * scale])
})

const crsProjections = {
  epsg4326: new L.Proj.CRS(
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', {
      origin: [-180, 90],
      resolutions: [
        0.5625,
        0.28125,
        0.140625,
        0.0703125,
        0.03515625,
        0.017578125,
        0.0087890625,
        0.00439453125,
        0.002197265625,
        0.00109863281,
        0.0005493164,
        0.0002746582,
        0.0001373291,
        0.00006866455
      ],
      bounds: L.Bounds([
        [-180, -90],
        [180, 90]
      ])
    }
  ),
  epsg3413: new L.Proj.CRS(
    'EPSG:3413',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0'
    + '+y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
      origin: [-4194304, 4194304],
      resolutions: [
        8192.0,
        4096.0,
        2048.0,
        1024.0,
        512.0,
        256.0
      ],
      bounds: L.Bounds([
        [-4194304, -4194304],
        [4194304, 4194304]
      ])
    }
  ),
  epsg3031: new L.Proj.CRS(
    'EPSG:3031',
    '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0'
    + '+y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
      origin: [-4194304, 4194304],
      resolutions: [
        8192.0,
        4096.0,
        2048.0,
        1024.0,
        512.0,
        256.0
      ],
      bounds: L.Bounds([
        [-4194304, -4194304],
        [4194304, 4194304]
      ])
    }
  ),
  simpleScaled: (scale) => (
    L.extend({}, L.CRS.Simple, { projection: ScaledLonLatProjection(scale) })
  )
}

export default crsProjections
