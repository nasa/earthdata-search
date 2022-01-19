import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SpatialDisplay from '../../components/SpatialDisplay/SpatialDisplay'

export const mapDispatchToProps = (dispatch) => ({
  onChangeQuery: (query) => dispatch(actions.changeQuery(query)),
  onRemoveSpatialFilter: () => dispatch(actions.removeSpatialFilter())
})

export const mapStateToProps = (state) => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  lineSearch: state.query.collection.spatial.line,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  shapefile: state.shapefile
})

export const SpatialDisplayContainer = (props) => {
  const {
    boundingBoxSearch,
    circleSearch,
    displaySpatialPolygonWarning,
    drawingNewLayer,
    lineSearch,
    onChangeQuery,
    onRemoveSpatialFilter,
    pointSearch,
    polygonSearch,
    shapefile
  } = props

  return (
    <SpatialDisplay
      boundingBoxSearch={boundingBoxSearch}
      circleSearch={circleSearch}
      displaySpatialPolygonWarning={displaySpatialPolygonWarning}
      drawingNewLayer={drawingNewLayer}
      lineSearch={lineSearch}
      onChangeQuery={onChangeQuery}
      onRemoveSpatialFilter={onRemoveSpatialFilter}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      shapefile={shapefile}
    />
  )
}

SpatialDisplayContainer.defaultProps = {
  boundingBoxSearch: [],
  circleSearch: [],
  lineSearch: [],
  pointSearch: [],
  polygonSearch: [],
  shapefile: {}
}

SpatialDisplayContainer.propTypes = {
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string),
  circleSearch: PropTypes.arrayOf(PropTypes.string),
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string),
  onChangeQuery: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  shapefile: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialDisplayContainer)
