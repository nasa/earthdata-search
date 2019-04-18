import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import { decodeUrlParams, encodeUrlQuery } from '../../util/url/url'

const mapDispatchToProps = dispatch => ({
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
  focusedCollection: state.focusedCollection.collectionId,
  keywordSearch: state.query.keyword,
  map: state.map,
  pathname: state.router.location.pathname,
  pointSearch: state.query.spatial.point,
  polygonSearch: state.query.spatial.polygon,
  search: state.router.location.search,
  temporalSearch: state.query.temporal,
  timeline: state.timeline
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      onChangeFocusedCollection,
      onChangeMap,
      onChangeQuery,
      onChangeTimelineQuery,
      onChangeTimelineState,
      search
    } = this.props

    const {
      focusedCollection,
      map,
      query,
      timeline
    } = decodeUrlParams(search)

    onChangeQuery({ ...query })

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
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeTimelineState: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
