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

export const backgroundStyle = new Style({
  stroke: new Stroke({
    color: backgroundColor,
    width: 1
  })
})

export const backgroundPointStyle = new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: backgroundColor,
      width: 1
    })
  })
})

export const granuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index),
    width: 2
  })
})

export const deemphisizedGranuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index, true),
    width: 1
  })
})

export const pointStyle = (index) => new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: getColorByIndex(index),
      width: 1
    })
  })
})

export const deemphisizedPointStyle = (index) => new Style({
  image: new CircleStyle({
    radius: pointRadius,
    stroke: new Stroke({
      color: getColorByIndex(index, true),
      width: 1
    })
  })
})

export const highlightedGranuleStyle = (index) => new Style({
  stroke: new Stroke({
    color: getColorByIndex(index),
    width: 4
  }),
  fill: new Fill({
    color: highlightedFillColor
  })
})

export const highlightedPointStyle = (index) => new Style({
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

const drawingMarkerSvg = '<svg stroke="%23FFFFFF" fill="%230099ff" xmlns="http://www.w3.org/2000/svg" stroke-width="1" width="1rem" height="1rem" viewBox="0 0 20 20" role="img" data-reactroot=""><path fill="%230099ff" fill-rule="evenodd" d="M10.457 19.544C13.798 16.214 17 13.02 17 8A7 7 0 1 0 3 8c0 5.021 3.202 8.213 6.543 11.544L10 20zM10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clip-rule="evenodd"></path></svg>'

export const markerDrawingStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${drawingMarkerSvg}`,
    scale: 2
  })
})

const markerSvg = '<svg stroke="%23FFFFFF66" fill="%230099ff" xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="1rem" height="1rem" viewBox="0 0 20 20" role="img" data-reactroot=""><path fill="%230099ff" fill-rule="evenodd" d="M10.457 19.544C13.798 16.214 17 13.02 17 8A7 7 0 1 0 3 8c0 5.021 3.202 8.213 6.543 11.544L10 20zM10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clip-rule="evenodd"></path></svg>'

export const markerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${markerSvg}`,
    scale: 2
  })
})

const unselectedMarkerSvg = '<svg stroke="%23FFFFFF66" fill="%23EA6F24" xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="1rem" height="1rem" viewBox="0 0 20 20" role="img" data-reactroot=""><path fill="%23EA6F24" fill-rule="evenodd" d="M10.457 19.544C13.798 16.214 17 13.02 17 8A7 7 0 1 0 3 8c0 5.021 3.202 8.213 6.543 11.544L10 20zM10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clip-rule="evenodd"></path></svg>'

export const unselectedMarkerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${unselectedMarkerSvg}`,
    scale: 2
  })
})

const hoveredMarkerSvg = '<svg stroke="%2347DA84" fill="%2347DA8433" xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="1rem" height="1rem" viewBox="0 0 20 20" role="img" data-reactroot=""><path fill="%2347DA8433" fill-rule="evenodd" d="M10.457 19.544C13.798 16.214 17 13.02 17 8A7 7 0 1 0 3 8c0 5.021 3.202 8.213 6.543 11.544L10 20zM10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clip-rule="evenodd"></path></svg>'

export const hoveredMarkerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml,${hoveredMarkerSvg}`,
    scale: 2
  })
})

export const spatialSearchStyle = new Style({
  stroke: new Stroke({
    color: '#0099ff',
    width: 3
  })
})

export const mbrStyle = new Style({
  stroke: new Stroke({
    color: '#C0392B',
    width: 3,
    lineDash: [2, 10],
    opacity: 0.8
  })
})

export const unselectedShapefileStyle = new Style({
  stroke: new Stroke({
    color: '#EA6F24',
    width: 1
  })
})

export const hoveredShapefileStyle = new Style({
  stroke: new Stroke({
    color: '#47DA84',
    width: 2
  }),
  fill: new Fill({
    color: '#47DA8433'
  })
})

export const shapefileSelectedStyle = new Style({
})
