import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SpatialDisplay from '../../components/SpatialDisplay/SpatialDisplay'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onGranuleGridCoords: coords => dispatch(actions.changeGranuleGridCoords(coords)),
  onRemoveGridFilter: () => dispatch(actions.removeGridFilter()),
  onRemoveSpatialFilter: () => dispatch(actions.removeSpatialFilter())
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  gridCoords: state.query.granule.gridCoords,
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
    displaySpatialPolygonWarning,
    drawingNewLayer,
    gridName,
    gridCoords,
    lineSearch,
    onChangeQuery,
    onGranuleGridCoords,
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
      displaySpatialPolygonWarning={displaySpatialPolygonWarning}
      drawingNewLayer={drawingNewLayer}
      gridName={gridName}
      gridCoords={gridCoords}
      lineSearch={lineSearch}
      onChangeQuery={onChangeQuery}
      onGranuleGridCoords={onGranuleGridCoords}
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
  boundingBoxSearch: '',
  gridName: '',
  gridCoords: '',
  lineSearch: '',
  pointSearch: '',
  polygonSearch: '',
  shapefile: {}
}

SpatialDisplayContainer.propTypes = {
  boundingBoxSearch: PropTypes.string,
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  gridName: PropTypes.string,
  gridCoords: PropTypes.string,
  lineSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onGranuleGridCoords: PropTypes.func.isRequired,
  onRemoveGridFilter: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  selectingNewGrid: PropTypes.bool.isRequired,
  shapefile: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialDisplayContainer)
