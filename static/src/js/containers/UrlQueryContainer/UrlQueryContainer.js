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
  onChangeMap:
    query => dispatch(actions.changeMap(query)),
  onChangeQuery:
    query => dispatch(actions.changeQuery(query)),
  onChangeTimelineQuery:
    query => dispatch(actions.changeTimelineQuery(query)),
  onChangeTimelineState:
    state => dispatch(actions.changeTimelineState(state)),
  onChangeUrl:
    query => dispatch(actions.changeUrl(query))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  featureFacets: state.facetsParams.feature,
  focusedCollection: state.focusedCollection.collectionId,
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.collection.keyword,
  map: state.map,
  organizationFacets: state.facetsParams.cmr.data_center_h,
  pathname: state.router.location.pathname,
  platformFacets: state.facetsParams.cmr.platform_h,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
  projectFacets: state.facetsParams.cmr.project_h,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  search: state.router.location.search,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      onUpdateCmrFacet,
      onUpdateFeatureFacet,
      onChangeFocusedCollection,
      onChangeMap,
      onChangeQuery,
      onChangeTimelineQuery,
      onChangeTimelineState,
      search
    } = this.props

    const {
      cmrFacets,
      featureFacets,
      focusedCollection,
      map,
      query,
      timeline
    } = decodeUrlParams(search)

    if (map) {
      onChangeMap(map)
    }

    if (focusedCollection.collectionId) {
      onChangeFocusedCollection(focusedCollection.collectionId)
    }

    if (Object.keys(timeline).length > 0) {
      const { state, query } = timeline
      onChangeTimelineState(state)
      onChangeTimelineQuery(query)
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
  }

  componentWillReceiveProps(nextProps) {
    const { search: nextSearch } = nextProps
    const { onChangeUrl, search } = this.props

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
  onUpdateCmrFacet: PropTypes.func.isRequired,
  onUpdateFeatureFacet: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeTimelineState: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
