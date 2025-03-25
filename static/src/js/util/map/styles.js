import {
  Fill,
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

export const mbrStyle = new Style({
  stroke: new Stroke({
    color: '#c0392b',
    width: 3,
    lineDash: [2, 10],
    opacity: 0.8
  })
})
