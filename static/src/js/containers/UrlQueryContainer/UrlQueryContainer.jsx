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
import { getMapPreferences, getCollectionSortKeyParameter } from '../../selectors/preferences'

import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeUrl:
    (query) => dispatch(actions.changeUrl(query))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  autocompleteSelected: state.autocomplete.selected,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collectionsMetadata: getCollectionsMetadata(state),
  earthdataEnvironment: getEarthdataEnvironment(state),
  featureFacets: state.facetsParams.feature,
  focusedCollection: getFocusedCollectionId(state),
  focusedGranule: getFocusedGranuleId(state),
  granuleDataFormatFacets: state.facetsParams.cmr.granule_data_format_h,
  hasGranulesOrCwic: state.query.collection.hasGranulesOrCwic,
  horizontalDataResolutionRangeFacets: state.facetsParams.cmr.horizontal_data_resolution_range,
  latency: state.facetsParams.cmr.latency,
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
  location: state.router.location,
  mapPreferences: getMapPreferences(state),
  onlyEosdisCollections: state.query.collection.onlyEosdisCollections,
  organizationFacets: state.facetsParams.cmr.data_center_h,
  overrideTemporalSearch: state.query.collection.overrideTemporal,
  pathname: state.router.location.pathname,
  platformFacets: state.facetsParams.cmr.platforms_h,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
  project: state.project,
  projectFacets: state.facetsParams.cmr.project_h,
  query: state.query,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  paramCollectionSortKey: getCollectionSortKeyParameter(state),
  tagKey: state.query.collection.tagKey,
  temporalSearch: state.query.collection.temporal,
  twoDCoordinateSystemNameFacets: state.facetsParams.cmr.two_d_coordinate_system_name
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

  // Pull out values we have migrated to Zustand that are no longer passed as props
  const zustandValues = useEdscStore((state) => ({
    mapView: state.map.mapView,
    portalId: state.portal.portalId,
    selectedFeatures: state.shapefile.selectedFeatures,
    shapefileId: state.shapefile.shapefileId,
    timelineQuery: state.timeline.query
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
  onChangeUrl: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
