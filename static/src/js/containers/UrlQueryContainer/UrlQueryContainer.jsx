import {
  useEffect,
  useRef,
  useState
} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { encodeUrlQuery } from '../../util/url/url'
import { locationPropType } from '../../util/propTypes/location'

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

export const mapStateToProps = (state) => ({
  location: state.router.location,
  pathname: state.router.location.pathname
})

export const UrlQueryContainer = (props) => {
  const {
    children,
    location,
    onChangePath,
    onChangeUrl
  } = props
  const {
    pathname,
    search
  } = location

  const [currentPath, setCurrentPath] = useState('')
  const previousSearch = useRef(search)

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
    timelineQuery: state.timeline.query,
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

  useEffect(() => {
    onChangePath([pathname, search].filter(Boolean).join(''))
  }, [])

  useEffect(() => {
    // The only time the search prop changes is after the URL has been updated
    // So we only need to worry about encoding the query and updating the URL
    // if the previous search and next search are the same
    if (
      previousSearch.current === search
    ) {
      const nextPath = encodeUrlQuery({
        ...props,
        ...combinedZustandValues
      })

      if (currentPath !== nextPath) {
        setCurrentPath(nextPath)

        if (nextPath !== '') {
          onChangeUrl(nextPath)
        }
      }
    }

    previousSearch.current = search
  }, [props, search, zustandValues])

  return children
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
