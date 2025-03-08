import proj4 from 'proj4'
import { get } from 'ol/proj'
import { register } from 'ol/proj/proj4'

// Geographic
proj4.defs(
  'EPSG:4326',
  '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
)

// Arctic Polar Stereographic
proj4.defs(
  'EPSG:3413',
  '+title=WGS 84 / NSIDC Sea Ice Polar Stereographic North +proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
)

// Antarctic Polar Stereographic
proj4.defs(
  'EPSG:3031',
  '+title=WGS 84 / Antarctic Polar Stereographic +proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
)

register(proj4)

const epsg4326 = get('EPSG:4326')
epsg4326.setExtent([-180, -90, 180, 90])

const epsg3413 = get('EPSG:3413')
epsg3413.setExtent([-4194304, -4194304, 4194304, 4194304])

const epsg3031 = get('EPSG:3031')
epsg3031.setExtent([-4194304, -4194304, 4194304, 4194304])

export const crsProjections = {
  epsg4326,
  epsg3413,
  epsg3031
}

export const projectionConfigs = {
  epsg4326: {
    center: [0, 0],
    enableRotation: false,
    maxZoom: 21,
    minZoom: 1,
    zoom: 3
  },
  epsg3413: {
    center: [0, 90],
    enableRotation: true,
    maxZoom: 12,
    minZoom: 0,
    zoom: 2
  },
  epsg3031: {
    center: [0, -90],
    enableRotation: true,
    maxZoom: 12,
    minZoom: 0,
    zoom: 2
  }
}
