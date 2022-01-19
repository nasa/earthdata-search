/* eslint-disable no-underscore-dangle */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import { metricsMap, metricsSpatialEdit } from '../../middleware/metrics/actions'

import { isPath } from '../../util/isPath'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import SpatialSelection from '../../components/SpatialSelection/SpatialSelection'

export const mapDispatchToProps = (dispatch) => ({
  onChangeQuery: (query) => dispatch(actions.changeQuery(query)),
  onMetricsMap: (type) => dispatch(metricsMap(type)),
  onMetricsSpatialEdit: (data) => dispatch(metricsSpatialEdit(data)),
  onRemoveSpatialFilter: () => dispatch(actions.removeSpatialFilter()),
  onToggleDrawingNewLayer: (state) => dispatch(actions.toggleDrawingNewLayer(state))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collectionMetadata: getFocusedCollectionMetadata(state),
  lineSearch: state.query.collection.spatial.line,
  router: state.router,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  shapefile: state.shapefile
})

export const SpatialSelectionContainer = (props) => {
  const {
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    collectionMetadata,
    lineSearch,
    mapRef,
    onChangeQuery,
    pointSearch,
    polygonSearch,
    router,
    shapefile,
    onToggleDrawingNewLayer,
    onMetricsMap,
    onMetricsSpatialEdit,
    onRemoveSpatialFilter
  } = props

  const { location } = router
  const { pathname } = location
  const isProjectPage = isPath(pathname, '/projects')

  const { isOpenSearch = false } = collectionMetadata

  const { leafletElement } = mapRef

  // If the map isn't loaded yet, don't render the spatial selection component
  if (!leafletElement) return null

  return (
    <SpatialSelection
      advancedSearch={advancedSearch}
      boundingBoxSearch={boundingBoxSearch}
      circleSearch={circleSearch}
      isOpenSearch={isOpenSearch}
      isProjectPage={isProjectPage}
      lineSearch={lineSearch}
      mapRef={mapRef}
      onChangeQuery={onChangeQuery}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      shapefile={shapefile}
      onToggleDrawingNewLayer={onToggleDrawingNewLayer}
      onMetricsMap={onMetricsMap}
      onMetricsSpatialEdit={onMetricsSpatialEdit}
      onRemoveSpatialFilter={onRemoveSpatialFilter}
    />
  )
}

SpatialSelectionContainer.defaultProps = {
  boundingBoxSearch: [],
  circleSearch: [],
  lineSearch: [],
  mapRef: {},
  pointSearch: [],
  polygonSearch: [],
  shapefile: {}
}

SpatialSelectionContainer.propTypes = {
  advancedSearch: PropTypes.shape({}).isRequired,
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string),
  circleSearch: PropTypes.arrayOf(PropTypes.string),
  collectionMetadata: PropTypes.shape({
    isOpenSearch: PropTypes.bool
  }).isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string),
  mapRef: PropTypes.shape({
    leafletElement: PropTypes.shape({})
  }),
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onMetricsSpatialEdit: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  router: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }).isRequired,
  shapefile: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialSelectionContainer)
