import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import MasterOverlayPanelContainer
  from '../../containers/MasterOverlayPanelContainer/MasterOverlayPanelContainer'
import SearchFormContainer
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
import GranuleResultsActionsContainer
  from '../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'
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

import actions from '../../actions'

import '../../components/CollectionResults/CollectionResults.scss'

const mapDispatchToProps = dispatch => ({
  onMasterOverlayHeightChange:
    newHeight => dispatch(actions.masterOverlayPanelResize(newHeight))
})

export class Search extends Component {
  componentDidMount() {
    const { onMasterOverlayHeightChange } = this.props

    // Set the height of the master overlay to 300px by default
    onMasterOverlayHeightChange(300)
  }

  render() {
    return (
      <div className="route-wrapper route-wrapper--search search">
        <MyDropzone />
        <SidebarContainer />
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            <SearchFormContainer />
            <SecondaryToolbarContainer />
          </header>
          <Switch>
            <Route exact path="/search">
              <MasterOverlayPanelContainer
                tabHandle={<CollectionResultsTabContainer />}
                header={<CollectionResultsHeader />}
                body={<CollectionResultsBodyContainer />}
              />
            </Route>
            <Route exact path="/search/granules">
              <MasterOverlayPanelContainer
                tabHandle={<GranuleResultsTabContainer />}
                header={<GranuleResultsHeaderContainer />}
                actions={<GranuleResultsActionsContainer />}
                body={<GranuleResultsBodyContainer />}
              />
            </Route>
            <Route exact path="/search/granules/granule-details">
              <MasterOverlayPanelContainer
                tabHandle={<GranuleDetailsTabContainer />}
                header={<GranuleDetailsHeaderContainer />}
                body={<GranuleDetailsBodyContainer />}
              />
            </Route>
          </Switch>
        </div>
        <FacetsModalContainer />
      </div>
    )
  }
}

Search.propTypes = {
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Search)
)
