import {
  Fill,
  Icon,
  Stroke,
  Style
} from 'ol/style'
import CircleStyle from 'ol/style/Circle'

import { getColorByIndex } from '../colors'

const backgroundColor = 'rgba(128, 128, 128, 0.6)'
export const pointRadius = 5
const highlightedFillColor = 'rgba(46, 204, 113, 0.2)'

const getMarkerSvg = (stroke, fill) => `<svg stroke="${encodeURIComponent(stroke)}" fill="${encodeURIComponent(fill)}" xmlns="http://www.w3.org/2000/svg" stroke-width="1" width="1rem" height="1rem" viewBox="0 0 20 20" role="img" data-reactroot=""><path fill="${encodeURIComponent(fill)}" fill-rule="evenodd" d="M10.457 19.544C13.798 16.214 17 13.02 17 8A7 7 0 1 0 3 8c0 5.021 3.202 8.213 6.543 11.544L10 20zM10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clip-rule="evenodd"></path></svg>`

// The background of the granules drawn on the map
export const backgroundGranuleStyle = new Style({
  stroke: new Stroke({
    color: backgroundColor,
    width: 1
  })
})

// The background of the granule points drawn on the map
export const backgroundGranulePointStyle = new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: backgroundColor,
      width: 1
    })
  })
})

// The granule outlines drawn on the map, color varies by index
export const granuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index),
    width: 2
  })
})

// The deemphisized granule outlines drawn on the map, color varies by index
export const deemphisizedGranuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index, true),
    width: 1
  })
})

// The granule points drawn on the map, color varies by index
export const granulePointStyle = (index) => new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: getColorByIndex(index),
      width: 1
    })
  })
})

// The deemphisized granule points drawn on the map, color varies by index
export const deemphisizedGranulePointStyle = (index) => new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: getColorByIndex(index, true),
      width: 1
    })
  })
})

// The highlighted granule outlines drawn on the map, color varies by index
export const highlightedGranuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index),
    width: 4
  }),
  fill: new Fill({
    color: highlightedFillColor
  })
})

// The highlighted granule points drawn on the map, color varies by index
export const highlightedGranulePointStyle = (index) => new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: getColorByIndex(index),
      width: 4
    }),
    fill: new Fill({
      color: highlightedFillColor
    })
  })
})

// The style for a spatial search
export const spatialSearchStyle = new Style({
  stroke: new Stroke({
    color: '#0099ff',
    width: 3
  })
})

// The style for a spatial search marker
export const spatialSearchMarkerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${getMarkerSvg('#FFFFFF66', '#0099ff')}`,
    scale: 2
  })
})

// The style for drawing a spatial search marker
export const spatialSearchMarkerDrawingStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${getMarkerSvg('#FFFFFF', '#0099ff')}`,
    scale: 2
  })
})

// The style for the MBR drawn on the map
export const mbrStyle = new Style({
  stroke: new Stroke({
    color: '#C0392B',
    width: 3,
    lineDash: [2, 10],
    opacity: 0.8
  })
})

// The style for an unselected shapefile shape
export const unselectedShapefileStyle = new Style({
  stroke: new Stroke({
    color: '#EA6F24',
    width: 1
  })
})

// The style for an unselected shapefile marker
export const unselectedShapefileMarkerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${getMarkerSvg('#FFFFFF66', '#EA6F24')}`,
    scale: 2
  })
})

// The style for a hovered shapefile shape
export const hoveredShapefileStyle = new Style({
  stroke: new Stroke({
    color: '#47DA84',
    width: 2
  }),
  fill: new Fill({
    color: '#47DA8433'
  })
})

// The style for a hovered shapefile marker
export const hoveredShapefileMarkerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${getMarkerSvg('#47DA84', '#47DA8433')}`,
    scale: 2
  })
})
