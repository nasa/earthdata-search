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
import CollectionDetailsTabContainer
  from '../../containers/CollectionDetailsTabContainer/CollectionDetailsTabContainer'
import CollectionDetailsBodyContainer
  from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import CollectionDetailsHeaderContainer
  from '../../containers/CollectionDetailsHeaderContainer/CollectionDetailsHeaderContainer'
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
import GranuleFiltersHeaderContainer
  from '../../containers/GranuleFiltersHeaderContainer/GranuleFiltersHeaderContainer'
import GranuleFiltersBodyContainer
  from '../../containers/GranuleFiltersBodyContainer/GranuleFiltersBodyContainer'
import GranuleFiltersActionsContainer
  from '../../containers/GranuleFiltersActionsContainer/GranuleFiltersActionsContainer'
import GranuleDetailsTabContainer
  from '../../containers/GranuleDetailsTabContainer/GranuleDetailsTabContainer'
import GranuleDetailsBodyContainer
  from '../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'
import GranuleDetailsHeaderContainer
  from '../../containers/GranuleDetailsHeaderContainer/GranuleDetailsHeaderContainer'
import RelatedUrlsModalContainer
  from '../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import SecondaryOverlayPanelContainer
  from '../../containers/SecondaryOverlayPanelContainer/SecondaryOverlayPanelContainer'
import CollectionResultsHeaderContainer
  from '../../containers/CollectionResultsHeaderContainer/CollectionResultsHeaderContainer'
import FacetsContainer from '../../containers/FacetsContainer/FacetsContainer'
import SidebarSection from '../../components/Sidebar/SidebarSection'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onMasterOverlayHeightChange:
    newHeight => dispatch(actions.masterOverlayPanelResize(newHeight))
})

export class Search extends Component {
  componentDidMount() {
    const { onMasterOverlayHeightChange } = this.props

    // Set the height of the master overlay to 500px by default
    const panelHeight = window.innerHeight ? window.innerHeight / 2 : 500
    onMasterOverlayHeightChange(panelHeight)
  }

  render() {
    return (
      <div className="route-wrapper route-wrapper--search search">
        <SidebarContainer>
          <SidebarSection sectionTitle="Browse Collections">
            <FacetsContainer />
          </SidebarSection>
        </SidebarContainer>
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            <SearchFormContainer />
            <SecondaryToolbarContainer />
          </header>
          <Switch>
            <Route exact path="/search">
              <MasterOverlayPanelContainer
                tabHandle={<CollectionResultsTabContainer />}
                header={<CollectionResultsHeaderContainer />}
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
              <SecondaryOverlayPanelContainer
                header={<GranuleFiltersHeaderContainer />}
                body={<GranuleFiltersBodyContainer />}
                footer={<GranuleFiltersActionsContainer />}
              />
            </Route>
            <Route exact path="/search/granules/granule-details">
              <MasterOverlayPanelContainer
                tabHandle={<GranuleDetailsTabContainer />}
                header={<GranuleDetailsHeaderContainer />}
                body={<GranuleDetailsBodyContainer />}
              />
            </Route>
            <Route exact path="/search/granules/collection-details">
              <MasterOverlayPanelContainer
                tabHandle={<CollectionDetailsTabContainer />}
                header={<CollectionDetailsHeaderContainer />}
                body={<CollectionDetailsBodyContainer />}
              />
            </Route>
          </Switch>
          <RelatedUrlsModalContainer />
          <FacetsModalContainer />
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Search)
)
