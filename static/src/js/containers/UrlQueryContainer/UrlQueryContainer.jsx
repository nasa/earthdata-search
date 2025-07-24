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

import { getCollectionsMetadata } from '../../selectors/collectionMetadata'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import {
  getMapPreferences,
  getCollectionSortKeyParameter
} from '../../zustand/selectors/preferences'

import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeUrl:
    (query) => dispatch(actions.changeUrl(query))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collectionsMetadata: getCollectionsMetadata(state),
  earthdataEnvironment: getEarthdataEnvironment(state),
  focusedCollection: getFocusedCollectionId(state),
  focusedGranule: getFocusedGranuleId(state),
  hasGranulesOrCwic: state.query.collection.hasGranulesOrCwic,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
  location: state.router.location,
  onlyEosdisCollections: state.query.collection.onlyEosdisCollections,
  overrideTemporalSearch: state.query.collection.overrideTemporal,
  pathname: state.router.location.pathname,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  query: state.query,
  tagKey: state.query.collection.tagKey,
  temporalSearch: state.query.collection.temporal
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
    featureFacets: state.facetParams.featureFacets,
    granuleDataFormatFacets: state.facetParams.cmrFacets.granule_data_format_h,
    horizontalDataResolutionRangeFacets:
      state.facetParams.cmrFacets.horizontal_data_resolution_range,
    instrumentFacets: state.facetParams.cmrFacets.instrument_h,
    latency: state.facetParams.cmrFacets.latency,
    mapPreferences: getMapPreferences(state),
    mapView: state.map.mapView,
    organizationFacets: state.facetParams.cmrFacets.data_center_h,
    paramCollectionSortKey: getCollectionSortKeyParameter(state),
    platformFacets: state.facetParams.cmrFacets.platforms_h,
    portalId: state.portal.portalId,
    processingLevelFacets: state.facetParams.cmrFacets.processing_level_id_h,
    projectCollections: state.project.collections,
    projectFacets: state.facetParams.cmrFacets.project_h,
    scienceKeywordFacets: state.facetParams.cmrFacets.science_keywords_h,
    selectedFeatures: state.shapefile.selectedFeatures,
    shapefileId: state.shapefile.shapefileId,
    timelineQuery: state.timeline.query,
    twoDCoordinateSystemNameFacets: state.facetParams.cmrFacets.two_d_coordinate_system_name
  }))

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
        ...zustandValues
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
