/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import { encodeUrlQuery } from '../../util/url/url'


const mapDispatchToProps = dispatch => ({
  onChangePath:
    path => dispatch(actions.changePath(path)),
  onChangeUrl:
    (query, replace) => dispatch(actions.changeUrl(query, replace))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  collections: state.metadata.collections,
  granuleDownloadRetrievalId: state.granuleDownload.granuleDownloadParams.id,
  granuleDownloadCollectionId: state.granuleDownload.granuleDownloadParams.collection_id,
  gridName: state.query.collection.gridName,
  gridCoords: state.query.granule.gridCoords,
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
  static whyDidYouRender = true

  componentDidMount() {
    const {
      onChangePath,
      search
    } = this.props

    onChangePath(search)
  }

  componentWillReceiveProps(nextProps) {
    console.warn('recieving props')
    const { search: nextSearch } = nextProps
    const { onChangeUrl, search } = this.props

    // The only time the search prop changes is after the URL has been updated
    // So we only need to worry about encoding the query and updating the URL
    // if the previous search and next search are the same
    const path = encodeUrlQuery(this.props)
    const nextPath = encodeUrlQuery(nextProps)

    console.warn('path === nextPath', path === nextPath)

    // if (
    //   !isEqual(this.props.featureFacets, nextProps.featureFacets)
    //   || !isEqual(this.props.project.collectionIds, nextProps.project.collectionIds)
    //   || !isEqual(this.props.focusedCollection, nextProps.focusedCollection)
    // ) {
    //   onChangeUrl(nextPath, false)
    //   // onChangePath(nextPath)
    //   return
    // }

    // onChangeUrl(nextPath)

    console.warn('search', search)
    console.warn('nextSearch', nextSearch)

    if (search === nextSearch) {
      if (path !== '') {
        console.warn('change url from urlQueryContainer')
        onChangeUrl(nextPath)
      }
    }
  }

  render() {
    console.warn('URL QUERY ')
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
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
