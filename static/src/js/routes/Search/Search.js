import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'

import actions from '../../actions/index'

import GranuleResults from './GranuleResults/GranuleResults'
import CollectionResults from './CollectionResults/CollectionResults'
import EdscMap from '../../components/Map/Map'
import MyDropzone from '../../components/MyDropzone/MyDropzone'
import Sidebar from './Sidebar/Sidebar'
import Toolbar from './Toolbar/Toolbar'

import './Search.scss'

const urlPropsQueryConfig = {
  query: { type: UrlQueryParamTypes.string, queryParam: 'q' },
  p: { type: UrlQueryParamTypes.string, queryParam: 'p' }
}

const mapStateToProps = state => ({
  collections: state.entities.collections,
  granules: state.entities.granules
})

const mapDispatchToProps = dispatch => ({
  addClick: () => {
    dispatch(actions.addClick())
  },
  onChangeQuery: ({ query }) => {
    dispatch(actions.changeQuery(query))
  },
  onChangeP: ({ p }) => {
    dispatch(actions.changeP(p))
  }
})

class Search extends Component {
  componentDidMount() {
    const {
      query,
      p,
      onChangeQuery,
      onChangeP
    } = this.props
    onChangeQuery({ query })
    onChangeP({ p })
  }

  componentWillReceiveProps(nextProps) {
    const {
      query,
      p,
      onChangeQuery,
      onChangeP
    } = this.props
    if (query !== nextProps.query) {
      onChangeQuery({ query: nextProps.query })
    }
    if (p !== nextProps.p) {
      onChangeP({ p: nextProps.p })
    }
  }

  render() {
    const { match } = this.props

    return (
      <div className="route-wrapper route-wrapper--search search">
        <EdscMap />
        <MyDropzone />
        <Sidebar />
        <Toolbar />
        <div className="search__panel">
          <Switch>
            <Route exact path={match.path}>
              <CollectionResults />
            </Route>
            <Route path={`${match.path}/granules`}>
              <GranuleResults />
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

Search.defaultProps = {
  query: '',
  p: ''
}

Search.propTypes = {
  collections: PropTypes.shape({
    results: PropTypes.array
  }).isRequired,
  granules: PropTypes.shape({
    results: PropTypes.array
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  query: PropTypes.string,
  p: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeP: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default addUrlProps({ urlPropsQueryConfig })(
  withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Search)
  )
)
