import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import CollectionResultsContainer from '../../containers/CollectionResultsContainer/CollectionResultsContainer'
import ConnectedEdscMapContainer from '../../containers/MapContainer/MapContainer'
import ConnectedMasterOverlayPanelContainer from '../../containers/MasterOverlayPanelContainer/MasterOverlayPanelContainer'
import ConnectedSearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import GranuleResultsContainer from '../../containers/GranuleResultsContainer/GranuleResultsContainer'
import MyDropzone from '../../components/MyDropzone/MyDropzone'
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'

import './Search.scss'


const Search = (props) => {
  const { match } = props

  return (
    <div className="route-wrapper route-wrapper--search search">
      <ConnectedEdscMapContainer />
      <MyDropzone />
      <SidebarContainer />
      <ConnectedSearchFormContainer />
      <ConnectedMasterOverlayPanelContainer>
        <Switch>
          <Route exact path={match.path}>
            <CollectionResultsContainer />
          </Route>
          <Route path={`${match.path}/granules`}>
            <GranuleResultsContainer />
          </Route>
        </Switch>
      </ConnectedMasterOverlayPanelContainer>
    </div>
  )
}

Search.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(Search)
