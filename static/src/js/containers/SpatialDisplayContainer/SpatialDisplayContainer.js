import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SpatialDisplay from '../../components/SpatialDisplay/SpatialDisplay'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onRemoveGridFilter: () => dispatch(actions.removeGridFilter()),
  onRemoveSpatialFilter: () => dispatch(actions.removeSpatialFilter())
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  gridName: state.query.collection.gridName,
  lineSearch: state.query.collection.spatial.line,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  selectingNewGrid: state.ui.grid.selectingNewGrid,
  shapefile: state.shapefile
})

export const SpatialDisplayContainer = (props) => {
  const {
    boundingBoxSearch,
    circleSearch,
    displaySpatialPolygonWarning,
    drawingNewLayer,
    gridName,
    lineSearch,
    onChangeQuery,
    onRemoveGridFilter,
    onRemoveSpatialFilter,
    pointSearch,
    polygonSearch,
    selectingNewGrid,
    shapefile
  } = props

  return (
    <SpatialDisplay
      boundingBoxSearch={boundingBoxSearch}
      circleSearch={circleSearch}
      displaySpatialPolygonWarning={displaySpatialPolygonWarning}
      drawingNewLayer={drawingNewLayer}
      gridName={gridName}
      lineSearch={lineSearch}
      onChangeQuery={onChangeQuery}
      onRemoveGridFilter={onRemoveGridFilter}
      onRemoveSpatialFilter={onRemoveSpatialFilter}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      selectingNewGrid={selectingNewGrid}
      shapefile={shapefile}
    />
  )
}

SpatialDisplayContainer.defaultProps = {
  boundingBoxSearch: [],
  circleSearch: [],
  gridName: '',
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
  gridName: PropTypes.string,
  lineSearch: PropTypes.arrayOf(PropTypes.string),
  onChangeQuery: PropTypes.func.isRequired,
  onRemoveGridFilter: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  selectingNewGrid: PropTypes.bool.isRequired,
  shapefile: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialDisplayContainer)
