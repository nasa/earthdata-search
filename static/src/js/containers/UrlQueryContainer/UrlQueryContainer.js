import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'
import actions from '../../actions/index'

const urlPropsQueryConfig = {
  keywordSearchFromUrl: { type: UrlQueryParamTypes.string, queryParam: 'q' },
  pointSearchFromUrl: { type: UrlQueryParamTypes.string, queryParam: 'sp' },
  boundingBoxSearchFromUrl: { type: UrlQueryParamTypes.string, queryParam: 'sb' },
  polygonSearchFromUrl: { type: UrlQueryParamTypes.string, queryParam: 'polygon' },
  mapParamFromUrl: { type: UrlQueryParamTypes.string, queryParam: 'm' }
}

const mapDispatchToProps = dispatch => ({
  onChangeUrl: query => dispatch(actions.changeUrl(query)),
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeMap: query => dispatch(actions.changeMap(query))
})

const mapStateToProps = state => ({
  keywordSearch: state.query.keyword,
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon,
  mapParam: state.map.mapParam
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    console.log('componentDidMount UrlQueryContainer')
    const {
      keywordSearchFromUrl,
      pointSearchFromUrl,
      boundingBoxSearchFromUrl,
      polygonSearchFromUrl,
      mapParamFromUrl,
      onChangeQuery,
      onChangeMap
    } = this.props

    // build the query
    const newQuery = {
      keyword: keywordSearchFromUrl
    }

    if (pointSearchFromUrl !== '') {
      newQuery.spatial = { point: pointSearchFromUrl }
    }

    if (boundingBoxSearchFromUrl !== '') {
      newQuery.spatial = { boundingBox: boundingBoxSearchFromUrl }
    }

    if (polygonSearchFromUrl !== '') {
      newQuery.spatial = { polygon: polygonSearchFromUrl }
    }

    onChangeQuery({ ...newQuery })

    if (mapParamFromUrl !== '') {
      onChangeMap({ mapParam: mapParamFromUrl })
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps UrlQueryContainer', nextProps)
    const { onChangeUrl } = this.props

    const {
      keywordSearch,
      pointSearch,
      boundingBoxSearch,
      polygonSearch,
      mapParam
    } = nextProps

    const newQuery = {
      q: keywordSearch,
      sp: pointSearch,
      sb: boundingBoxSearch,
      polygon: polygonSearch,
      m: mapParam
    }

    if (newQuery !== {}) {
      onChangeUrl({ ...newQuery })
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
  keywordSearch: '',
  keywordSearchFromUrl: '',
  pointSearch: '',
  pointSearchFromUrl: '',
  boundingBoxSearch: '',
  boundingBoxSearchFromUrl: '',
  polygonSearch: '',
  polygonSearchFromUrl: '',
  mapParam: '',
  mapParamFromUrl: ''
}

UrlQueryContainer.propTypes = {
  keywordSearch: PropTypes.string,
  keywordSearchFromUrl: PropTypes.string,
  pointSearch: PropTypes.string,
  pointSearchFromUrl: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  boundingBoxSearchFromUrl: PropTypes.string,
  polygonSearch: PropTypes.string,
  polygonSearchFromUrl: PropTypes.string,
  mapParam: PropTypes.string,
  mapParamFromUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired
}

export default addUrlProps({ urlPropsQueryConfig })(
  connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
)
