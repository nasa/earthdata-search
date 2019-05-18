/* eslint-disable no-underscore-dangle */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SpatialSelection from '../../components/SpatialSelection/SpatialSelection'

const mapDispathToProps = dispatch => ({
  onChangeMap: query => dispatch(actions.changeMap(query)),
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon
})

export const SpatialSelectionContainer = (props) => {
  const {
    boundingBoxSearch,
    mapRef,
    onChangeMap,
    onChangeQuery,
    pointSearch,
    polygonSearch
  } = props

  return (
    <SpatialSelection
      boundingBoxSearch={boundingBoxSearch}
      mapRef={mapRef}
      onChangeMap={onChangeMap}
      onChangeQuery={onChangeQuery}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
    />
  )
}

SpatialSelectionContainer.defaultProps = {
  boundingBoxSearch: '',
  mapRef: {},
  pointSearch: '',
  polygonSearch: ''
}

SpatialSelectionContainer.propTypes = {
  boundingBoxSearch: PropTypes.string,
  mapRef: PropTypes.shape({}),
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string
}

export default connect(mapStateToProps, mapDispathToProps)(SpatialSelectionContainer)
