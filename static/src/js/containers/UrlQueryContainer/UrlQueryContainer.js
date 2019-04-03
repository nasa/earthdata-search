import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import { decodeUrlParams, encodeUrlQuery } from '../../util/url'

const mapDispatchToProps = dispatch => ({
  onChangeUrl: query => dispatch(actions.changeUrl(query)),
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeMap: query => dispatch(actions.changeMap(query)),
  onChangeFocusedCollection: collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  keywordSearch: state.query.keyword,
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon,
  mapParam: state.map.mapParam,
  focusedCollection: state.focusedCollection
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      search,
      onChangeQuery,
      onChangeMap,
      onChangeFocusedCollection
    } = this.props

    const {
      query,
      mapParam,
      focusedCollection
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
      <React.Fragment>
        { children }
      </React.Fragment>
    )
  }
}

UrlQueryContainer.defaultProps = {
  search: ''
}

UrlQueryContainer.propTypes = {
  search: PropTypes.string,
  children: PropTypes.node.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
