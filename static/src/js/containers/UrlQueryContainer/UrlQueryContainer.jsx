import { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

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
  mapPreferences: getMapPreferences(state),
  onlyEosdisCollections: state.query.collection.onlyEosdisCollections,
  organizationFacets: state.facetsParams.cmr.data_center_h,
  overrideTemporalSearch: state.query.collection.overrideTemporal,
  platformFacets: state.facetsParams.cmr.platforms_h,
  portalId: state.portal.portalId,
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
  twoDCoordinateSystemNameFacets: state.facetsParams.cmr.two_d_coordinate_system_name,
  savedProject: state.savedProject
})

export const UrlQueryContainer = (props) => {
  const setLastUpdated = useEdscStore((state) => state.reduxUpdated.setLastUpdated)

  const {
    children,
    onChangePath
  } = props

  useEffect(() => {
    const { pathname, search } = window.location
    onChangePath([pathname, search].filter(Boolean).join(''))
  }, [])

  // useEffect(() => {
  //   setLastUpdated(new Date().getTime())
  // }, [props])

  return children
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
