import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialDisplay from '../../components/SpatialDisplay/SpatialDisplay'

const mapStateToProps = state => ({
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon,
  drawingNewLayer: state.map.drawingNewLayer
})

export const SpatialDisplayContainer = (props) => {
  const {
    pointSearch,
    boundingBoxSearch,
    polygonSearch,
    drawingNewLayer
  } = props

  return (
    <SpatialDisplay
      pointSearch={pointSearch}
      boundingBoxSearch={boundingBoxSearch}
      polygonSearch={polygonSearch}
      drawingNewLayer={drawingNewLayer}
    />
  )
}

SpatialDisplayContainer.defaultProps = {
  pointSearch: '',
  boundingBoxSearch: '',
  polygonSearch: '',
  drawingNewLayer: ''
}

SpatialDisplayContainer.propTypes = {
  pointSearch: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  drawingNewLayer: PropTypes.string
}

export default connect(mapStateToProps)(SpatialDisplayContainer)
