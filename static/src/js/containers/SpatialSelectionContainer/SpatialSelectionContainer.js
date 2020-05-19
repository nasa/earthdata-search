/* eslint-disable no-underscore-dangle */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import { metricsMap, metricsSpatialEdit } from '../../middleware/metrics/actions'

import SpatialSelection from '../../components/SpatialSelection/SpatialSelection'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

const mapDispathToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onToggleDrawingNewLayer: state => dispatch(actions.toggleDrawingNewLayer(state)),
  onMetricsMap: type => dispatch(metricsMap(type)),
  onMetricsSpatialEdit: data => dispatch(metricsSpatialEdit(data))
})

const mapStateToProps = state => ({
  advancedSearch: state.advancedSearch,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  lineSearch: state.query.collection.spatial.line,
  pathname: state.router.location.pathname,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon
})

export const SpatialSelectionContainer = (props) => {
  const {
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    collections,
    focusedCollection,
    lineSearch,
    mapRef,
    onChangeQuery,
    pathname,
    pointSearch,
    polygonSearch,
    onToggleDrawingNewLayer,
    onMetricsMap,
    onMetricsSpatialEdit
  } = props

  const isProjectPage = pathname.startsWith('/project')

  const focusedCollectionObject = getFocusedCollectionObject(focusedCollection, collections)
  const { isCwic = false } = focusedCollectionObject

  return (
    <SpatialSelection
      advancedSearch={advancedSearch}
      boundingBoxSearch={boundingBoxSearch}
      circleSearch={circleSearch}
      isCwic={isCwic}
      isProjectPage={isProjectPage}
      lineSearch={lineSearch}
      mapRef={mapRef}
      onChangeQuery={onChangeQuery}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      onToggleDrawingNewLayer={onToggleDrawingNewLayer}
      onMetricsMap={onMetricsMap}
      onMetricsSpatialEdit={onMetricsSpatialEdit}
    />
  )
}

SpatialSelectionContainer.defaultProps = {
  boundingBoxSearch: '',
  circleSearch: '',
  lineSearch: '',
  mapRef: {},
  pointSearch: '',
  polygonSearch: ''
}

SpatialSelectionContainer.propTypes = {
  advancedSearch: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  boundingBoxSearch: PropTypes.string,
  circleSearch: PropTypes.string,
  lineSearch: PropTypes.string,
  mapRef: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onMetricsSpatialEdit: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispathToProps)(SpatialSelectionContainer)
