import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import { decodeUrlParams, encodeUrlQuery } from '../../util/url'

const mapDispatchToProps = dispatch => ({
  onChangeFocusedCollection:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onChangeMap:
    query => dispatch(actions.changeMap(query)),
  onChangeQuery:
    query => dispatch(actions.changeQuery(query)),
  onChangeUrl:
    query => dispatch(actions.changeUrl(query))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.spatial.boundingBox,
  focusedCollection: state.focusedCollection,
  keywordSearch: state.query.keyword,
  mapParam: state.map.mapParam,
  pathname: state.router.location.pathname,
  pointSearch: state.query.spatial.point,
  polygonSearch: state.query.spatial.polygon,
  search: state.router.location.search,
  temporalSearch: state.query.temporal
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      onChangeFocusedCollection,
      onChangeMap,
      onChangeQuery,
      search
    } = this.props

    const {
      focusedCollection,
      mapParam,
      query
    } = decodeUrlParams(search)

    onChangeQuery({ ...query })

    if (mapParam) {
      onChangeMap({ ...mapParam })
    }

    if (focusedCollection) {
      onChangeFocusedCollection(focusedCollection)
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
  onChangeUrl: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
