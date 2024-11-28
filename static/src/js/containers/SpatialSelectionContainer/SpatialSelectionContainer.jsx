/* eslint-disable no-underscore-dangle */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useMap } from 'react-leaflet'

import actions from '../../actions'
import { metricsMap, metricsSpatialEdit } from '../../middleware/metrics/actions'

import { isPath } from '../../util/isPath'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getProjectCollections } from '../../selectors/project'

import SpatialSelection from '../../components/SpatialSelection/SpatialSelection'

export const mapDispatchToProps = (dispatch) => ({
  onChangeMap: (query) => dispatch(actions.changeMap(query)),
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
  projectCollections: getProjectCollections(state),
  shapefile: state.shapefile
})

export const SpatialSelectionContainer = (props) => {
  const map = useMap()
  const {
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    collectionMetadata,
    lineSearch,
    onChangeQuery,
    pointSearch,
    polygonSearch,
    projectCollections,
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

  // If the map isn't loaded yet, don't render the spatial selection component
  if (!map) return null

  return (
    <SpatialSelection
      advancedSearch={advancedSearch}
      boundingBoxSearch={boundingBoxSearch}
      circleSearch={circleSearch}
      isOpenSearch={isOpenSearch}
      isProjectPage={isProjectPage}
      lineSearch={lineSearch}
      onChangeQuery={onChangeQuery}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
      projectCollections={projectCollections}
      shapefile={shapefile}
      onToggleDrawingNewLayer={onToggleDrawingNewLayer}
      onMetricsMap={onMetricsMap}
      onMetricsSpatialEdit={onMetricsSpatialEdit}
      onRemoveSpatialFilter={onRemoveSpatialFilter}
      map={map}
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
    leafletElement: PropTypes.shape({
      removeLayer: PropTypes.func,
      latLngToLayerPoint: PropTypes.func
    })
  }),
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onMetricsSpatialEdit: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  projectCollections: PropTypes.shape({}).isRequired,
  router: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }).isRequired,
  shapefile: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialSelectionContainer)
