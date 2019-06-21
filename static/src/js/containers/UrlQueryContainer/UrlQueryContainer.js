import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import { decodeUrlParams, encodeUrlQuery } from '../../util/url/url'

const mapDispatchToProps = dispatch => ({
  onUpdateCmrFacet:
    facet => dispatch(actions.updateCmrFacet(facet)),
  onUpdateFeatureFacet:
    facet => dispatch(actions.updateFeatureFacet(facet)),
  onChangeFocusedCollection:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onChangeFocusedGranule:
    granuleId => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeMap:
    query => dispatch(actions.changeMap(query)),
  onChangeQuery:
    query => dispatch(actions.changeQuery(query)),
  onChangeTimelineQuery:
    query => dispatch(actions.changeTimelineQuery(query)),
  onChangeUrl:
    query => dispatch(actions.changeUrl(query)),
  onUpdateGranuleDownloadParams:
    params => dispatch(actions.updateGranuleDownloadParams(params)),
  onRestoreCollections:
    collections => dispatch(actions.restoreCollections(collections)),
  onRestoreProject:
    project => dispatch(actions.restoreProject(project))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  collections: state.metadata.collections,
  granuleDownloadRetrievalId: state.granuleDownloadParams.retrievalId,
  granuleDownloadCollectionId: state.granuleDownloadParams.collectionId,
  featureFacets: state.facetsParams.feature,
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.collection.keyword,
  map: state.map,
  organizationFacets: state.facetsParams.cmr.data_center_h,
  overrideTemporalSearch: state.query.collection.overrideTemporal,
  pathname: state.router.location.pathname,
  platformFacets: state.facetsParams.cmr.platform_h,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
  project: state.project,
  projectFacets: state.facetsParams.cmr.project_h,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  search: state.router.location.search,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      onChangeFocusedCollection,
      onChangeFocusedGranule,
      onChangeMap,
      onChangeQuery,
      onChangeTimelineQuery,
      onRestoreCollections,
      onRestoreProject,
      onUpdateCmrFacet,
      onUpdateGranuleDownloadParams,
      onUpdateFeatureFacet,
      search
    } = this.props

    const {
      collections,
      cmrFacets,
      granuleDownloadParams,
      featureFacets,
      focusedCollection,
      focusedGranule,
      map,
      project,
      query,
      timeline
    } = decodeUrlParams(search)

    if (map) {
      onChangeMap(map)
    }

    if (focusedGranule) {
      onChangeFocusedGranule(focusedGranule)
    }

    if (timeline) {
      onChangeTimelineQuery(timeline)
    }

    if (featureFacets) {
      onUpdateFeatureFacet(featureFacets)
    }

    if (cmrFacets) {
      onUpdateCmrFacet(cmrFacets)
    }

    if (Object.keys(query).length > 0) {
      onChangeQuery({ ...query })
    }

    if (project) {
      onRestoreProject(project)
    }

    if (collections) {
      onRestoreCollections(collections)
    }

    if (focusedCollection) {
      onChangeFocusedCollection(focusedCollection)
    }

    if (granuleDownloadParams) {
      onUpdateGranuleDownloadParams(granuleDownloadParams)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { search: nextSearch } = nextProps
    const { onChangeUrl, search } = this.props
    // console.log(this.props)
    // The only time the search prop changes is after the URL has been updated
    // So we only need to worry about encoding the query and updating the URL
    // if the previous search and next search are the same
    if (search === nextSearch) {
      const path = encodeUrlQuery(nextProps)

      if (path !== '') {
        onChangeUrl(path)
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

UrlQueryContainer.defaultProps = {
  search: ''
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onRestoreCollections: PropTypes.func.isRequired,
  onRestoreProject: PropTypes.func.isRequired,
  onUpdateCmrFacet: PropTypes.func.isRequired,
  onUpdateGranuleDownloadParams: PropTypes.func.isRequired,
  onUpdateFeatureFacet: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
