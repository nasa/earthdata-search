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
  drawingNewLayer: state.ui.map.drawingNewLayer,
  grid: state.query.collection.grid,
  gridCoords: state.query.granule.gridCoords,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  selectingNewGrid: state.ui.grid.selectingNewGrid
})

export const SpatialDisplayContainer = (props) => {
  const {
    boundingBoxSearch,
    drawingNewLayer,
    grid,
    gridCoords,
    onChangeQuery,
    onGranuleGridCoords,
    onRemoveGridFilter,
    onRemoveSpatialFilter,
    pointSearch,
    polygonSearch,
    selectingNewGrid
  } = props

  return (
    <SpatialDisplay
      boundingBoxSearch={boundingBoxSearch}
      drawingNewLayer={drawingNewLayer}
      grid={grid}
      gridCoords={gridCoords}
      onChangeQuery={onChangeQuery}
      onGranuleGridCoords={onGranuleGridCoords}
      onRemoveGridFilter={onRemoveGridFilter}
      onRemoveSpatialFilter={onRemoveSpatialFilter}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      selectingNewGrid={selectingNewGrid}
    />
  )
}

SpatialDisplayContainer.defaultProps = {
  boundingBoxSearch: '',
  grid: '',
  gridCoords: '',
  pointSearch: '',
  polygonSearch: ''
}

SpatialDisplayContainer.propTypes = {
  boundingBoxSearch: PropTypes.string,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  grid: PropTypes.string,
  gridCoords: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onGranuleGridCoords: PropTypes.func.isRequired,
  onRemoveGridFilter: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  selectingNewGrid: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialDisplayContainer)
