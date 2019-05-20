import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import ConnectedEdscMapContainer
  from '../../containers/MapContainer/MapContainer'
import ConnectedMasterOverlayPanelContainer
  from '../../containers/MasterOverlayPanelContainer/MasterOverlayPanelContainer'
import ConnectedSearchFormContainer
  from '../../containers/SearchFormContainer/SearchFormContainer'
import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import CollectionResultsTabContainer
  from '../../containers/CollectionResultsTabContainer/CollectionResultsTabContainer'
import FacetsModalContainer
  from '../../containers/FacetsModalContainer/FacetsModalContainer'
import GranuleResultsTabContainer
  from '../../containers/GranuleResultsTabContainer/GranuleResultsTabContainer'
import GranuleResultsBodyContainer
  from '../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import GranuleResultsHeaderContainer
  from '../../containers/GranuleResultsHeaderContainer/GranuleResultsHeaderContainer'
import GranuleDetailsTabContainer
  from '../../containers/GranuleDetailsTabContainer/GranuleDetailsTabContainer'
import GranuleDetailsBodyContainer
  from '../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'
import GranuleDetailsHeaderContainer
  from '../../containers/GranuleDetailsHeaderContainer/GranuleDetailsHeaderContainer'
import MyDropzone
  from '../../components/MyDropzone/MyDropzone'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import CollectionResultsHeader
  from '../../components/CollectionResults/CollectionResultsHeader'

import '../../components/CollectionResults/CollectionResults.scss'

const Search = () => (
  <div className="route-wrapper route-wrapper--search search">
    <ConnectedEdscMapContainer />
    <MyDropzone />
    <SidebarContainer />
    <ConnectedSearchFormContainer />
    <SecondaryToolbarContainer />
    <Switch>
      <Route exact path="/search">
        <ConnectedMasterOverlayPanelContainer
          tabHandle={<CollectionResultsTabContainer />}
          header={<CollectionResultsHeader />}
          body={<CollectionResultsBodyContainer />}
        />
      </Route>
      <Route exact path="/search/granules">
        <ConnectedMasterOverlayPanelContainer
          tabHandle={<GranuleResultsTabContainer />}
          header={<GranuleResultsHeaderContainer />}
          body={<GranuleResultsBodyContainer />}
        />
      </Route>
      <Route exact path="/search/granules/granule-details">
        <ConnectedMasterOverlayPanelContainer
          tabHandle={<GranuleDetailsTabContainer />}
          header={<GranuleDetailsHeaderContainer />}
          body={<GranuleDetailsBodyContainer />}
        />
      </Route>
    </Switch>
    <FacetsModalContainer />
  </div>
)

Search.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(Search)
