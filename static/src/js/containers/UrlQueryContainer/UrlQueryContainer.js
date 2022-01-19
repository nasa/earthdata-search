import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { encodeUrlQuery } from '../../util/url/url'
import { locationPropType } from '../../util/propTypes/location'

import { getCollectionsMetadata } from '../../selectors/collectionMetadata'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getMapPreferences } from '../../selectors/preferences'

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
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
  location: state.router.location,
  map: state.map,
  mapPreferences: getMapPreferences(state),
  organizationFacets: state.facetsParams.cmr.data_center_h,
  overrideTemporalSearch: state.query.collection.overrideTemporal,
  pathname: state.router.location.pathname,
  platformFacets: state.facetsParams.cmr.platform_h,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
  project: state.project,
  projectFacets: state.facetsParams.cmr.project_h,
  query: state.query,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  selectedFeatures: state.shapefile.selectedFeatures,
  shapefileId: state.shapefile.shapefileId,
  tagKey: state.query.collection.tagKey,
  temporalSearch: state.query.collection.temporal,
  twoDCoordinateSystemNameFacets: state.facetsParams.cmr.two_d_coordinate_system_name,
  timelineQuery: state.timeline.query
})

export class UrlQueryContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentPath: ''
    }
  }

  componentDidMount() {
    const {
      onChangePath,
      location
    } = this.props

    const {
      pathname,
      search
    } = location

    onChangePath([pathname, search].filter(Boolean).join(''))
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: nextLocation
    } = nextProps

    const {
      onChangeUrl,
      location
    } = this.props

    const { search } = location
    const { currentPath } = this.state

    const { search: nextSearch } = nextLocation

    // The only time the search prop changes is after the URL has been updated
    // So we only need to worry about encoding the query and updating the URL
    // if the previous search and next search are the same
    if (
      search === nextSearch
    ) {
      const nextPath = encodeUrlQuery(nextProps)
      if (currentPath !== nextPath) {
        this.setState({
          currentPath: nextPath
        })
        if (nextPath !== '') {
          onChangeUrl(nextPath)
        }
      }
    }
  }

  render() {
    const { children } = this.props
    return (
      <>
        { children }
      </>
    )
  }
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
