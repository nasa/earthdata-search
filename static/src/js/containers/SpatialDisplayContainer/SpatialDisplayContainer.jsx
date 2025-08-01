import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SpatialDisplay from '../../components/SpatialDisplay/SpatialDisplay'

export const mapStateToProps = (state) => ({
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer
})

export const SpatialDisplayContainer = (props) => {
  const {
    displaySpatialPolygonWarning,
    drawingNewLayer
  } = props

  return (
    <SpatialDisplay
      displaySpatialPolygonWarning={displaySpatialPolygonWarning}
      drawingNewLayer={drawingNewLayer}
    />
  )
}

SpatialDisplayContainer.propTypes = {
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired
}

export default connect(mapStateToProps)(SpatialDisplayContainer)
