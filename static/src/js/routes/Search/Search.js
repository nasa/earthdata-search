import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import GranuleResultsContainer
  from '../../containers/GranuleResultsContainer/GranuleResultsContainer'
import CollectionResultsContainer
  from '../../containers/CollectionResultsContainer/CollectionResultsContainer'
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ConnectedSearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'

import ConnectedEdscMapContainer from '../../containers/MapContainer/MapContainer'
import MyDropzone from '../../components/MyDropzone/MyDropzone'

import './Search.scss'


const Search = (props) => {
  const { match } = props

  return (
    <div className="route-wrapper route-wrapper--search search">
      <ConnectedEdscMapContainer />
      <MyDropzone />
      <SidebarContainer />
      <ConnectedSearchFormContainer />
      <div className="search__panel">
        <Switch>
          <Route exact path={match.path}>
            <CollectionResultsContainer />
          </Route>
          <Route path={`${match.path}/granules`}>
            <GranuleResultsContainer />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

Search.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(Search)
