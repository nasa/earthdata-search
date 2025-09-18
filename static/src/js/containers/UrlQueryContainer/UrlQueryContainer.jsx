import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import actions from '../../actions/index'

import { encodeUrlQuery } from '../../util/url/url'

import useEdscStore from '../../zustand/useEdscStore'
import {
  getCollectionsQuery,
  getSelectedRegionQuery,
  getNlpCollection
} from '../../zustand/selectors/query'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getCollectionId, getCollectionsMetadata } from '../../zustand/selectors/collection'
import { getGranuleId } from '../../zustand/selectors/granule'
import { getMapPreferences, getCollectionSortPreference } from '../../zustand/selectors/preferences'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeUrl:
    (query) => dispatch(actions.changeUrl(query))
})

export const UrlQueryContainer = (props) => {
  const {
    children,
    onChangePath,
    onChangeUrl
  } = props

  const location = useLocation()
  const {
    pathname,
    search
  } = location

  const [currentPath, setCurrentPath] = useState('')

  const zustandValues = useEdscStore((state) => ({
    collectionsMetadata: getCollectionsMetadata(state),
    collectionSortPreference: getCollectionSortPreference(state),
    earthdataEnvironment: getEarthdataEnvironment(state),
    featureFacets: state.facetParams.featureFacets,
    focusedCollection: getCollectionId(state),
    focusedGranule: getGranuleId(state),
    granuleDataFormatFacets: state.facetParams.cmrFacets.granule_data_format_h,
    horizontalDataResolutionRangeFacets:
      state.facetParams.cmrFacets.horizontal_data_resolution_range,
    instrumentFacets: state.facetParams.cmrFacets.instrument_h,
    latency: state.facetParams.cmrFacets.latency,
    mapPreferences: getMapPreferences(state),
    mapView: state.map.mapView,
    organizationFacets: state.facetParams.cmrFacets.data_center_h,
    platformFacets: state.facetParams.cmrFacets.platforms_h,
    portalId: state.portal.portalId,
    processingLevelFacets: state.facetParams.cmrFacets.processing_level_id_h,
    projectCollections: state.project.collections,
    projectFacets: state.facetParams.cmrFacets.project_h,
    nlpSearch: getNlpCollection(state)?.query,
    scienceKeywordFacets: state.facetParams.cmrFacets.science_keywords_h,
    selectedFeatures: state.shapefile.selectedFeatures,
    selectedRegion: getSelectedRegionQuery(state),
    shapefileId: state.shapefile.shapefileId,
    // TODO Add this back during EDSC-4569
    // timelineQuery: state.timeline.query,
    twoDCoordinateSystemNameFacets: state.facetParams.cmrFacets.two_d_coordinate_system_name
  }))
  const collectionsQuery = useEdscStore(getCollectionsQuery)
  const {
    spatial,
    hasGranulesOrCwic,
    keyword: keywordSearch,
    onlyEosdisCollections,
    overrideTemporal: overrideTemporalSearch,
    sortKey,
    tagKey,
    temporal: temporalSearch
  } = collectionsQuery
  const {
    boundingBox: boundingBoxSearch,
    circle: circleSearch,
    line: lineSearch,
    point: pointSearch,
    polygon: polygonSearch
  } = spatial

  const combinedZustandValues = {
    ...zustandValues,
    boundingBoxSearch,
    circleSearch,
    collectionSortKey: sortKey,
    collectionsQuery,
    hasGranulesOrCwic,
    keywordSearch,
    lineSearch,
    onlyEosdisCollections,
    overrideTemporalSearch,
    pointSearch,
    polygonSearch,
    tagKey,
    temporalSearch
  }

  // When the page loads, call onChangePath to load the values from the URL
  useEffect(() => {
    onChangePath([pathname, search].filter(Boolean).join(''))
  }, [])

  // When the Zustand state changes, encode the values and call onChangeUrl to update the URL
  useEffect(() => {
    const nextPath = encodeUrlQuery({
      ...combinedZustandValues,
      pathname
    })

    if (currentPath !== nextPath) {
      setCurrentPath(nextPath)

      if (nextPath !== '') {
        onChangeUrl(nextPath)
      }
    }
  }, [
    combinedZustandValues,
    pathname
  ])

  return children
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(UrlQueryContainer)
