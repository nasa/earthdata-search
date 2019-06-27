import React, { Component } from 'react'
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
  search: state.router.location.search
})

export class UrlQueryContainer extends Component {
  componentDidMount() {
    const {
      onChangePath,
      search
    } = this.props

    onChangePath(search)
  }

  componentWillReceiveProps(nextProps) {
    console.warn('componentWillReceiveProps URLQUERYCONTAINER')
    const { search: nextSearch } = nextProps
    const { onChangeUrl, search } = this.props

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
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  search: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlQueryContainer)
