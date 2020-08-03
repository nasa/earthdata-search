import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { encodeUrlQuery } from '../../util/url/url'

const mapDispatchToProps = dispatch => ({
  onChangePath:
    path => dispatch(actions.changePath(path)),
  onChangeUrl:
    query => dispatch(actions.changeUrl(query))
})

const mapStateToProps = state => ({
  advancedSearch: state.advancedSearch,
  autocompleteSelected: state.autocomplete.selected,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collectionsMetadata: state.metadata.collections,
  featureFacets: state.facetsParams.feature,
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  granuleDataFormatFacets: state.facetsParams.cmr.granule_data_format_h,
  gridName: state.query.collection.gridName,
  hasGranulesOrCwic: state.query.collection.hasGranulesOrCwic,
  instrumentFacets: state.facetsParams.cmr.instrument_h,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
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
  query: state.query,
  scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
  search: state.router.location.search,
  shapefileId: state.shapefile.shapefileId,
  tagKey: state.query.collection.tagKey,
  temporalSearch: state.query.collection.temporal,
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
      search
    } = this.props

    onChangePath(search)
  }

  componentWillReceiveProps(nextProps) {
    const {
      collectionsMetadata: nextCollectionsMetadata,
      search: nextSearch
    } = nextProps

    const {
      collectionsMetadata,
      onChangeUrl,
      search
    } = this.props

    const { currentPath } = this.state

    // The only time the search prop changes is after the URL has been updated
    // So we only need to worry about encoding the query and updating the URL
    // if the previous search and next search are the same
    if (
      search === nextSearch
      || collectionsMetadata === nextCollectionsMetadata
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

UrlQueryContainer.defaultProps = {
  search: ''
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
