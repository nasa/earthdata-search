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
  boundingBoxSearch: state.query.spatial.boundingBox,
  featureFacets: state.facetsParams.feature,
  focusedCollection: state.focusedCollection.collectionId,
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.keyword,
  map: state.map,
  organizationFacets: state.facetsParams.cmr.data_center_h,
  pathname: state.router.location.pathname,
  platformFacets: state.facetsParams.cmr.platform_h,
  pointSearch: state.query.spatial.point,
  polygonSearch: state.query.spatial.polygon,
  processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
  projectFacets: state.facetsParams.cmr.project_h,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  search: state.router.location.search,
  temporalSearch: state.query.temporal,
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

    if (timeline) {
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

    onChangeQuery({ ...query })
  }

  componentWillReceiveProps(nextProps) {
    const { onChangeUrl } = this.props

    const path = encodeUrlQuery(nextProps)

    if (path !== '') {
      onChangeUrl(path)
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
