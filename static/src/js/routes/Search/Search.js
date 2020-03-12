/* eslint-disable no-unused-vars */
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

import CollectionResultsTabContainer
  from '../../containers/CollectionResultsTabContainer/CollectionResultsTabContainer'
import CollectionDetailsTabContainer
  from '../../containers/CollectionDetailsTabContainer/CollectionDetailsTabContainer'
import CollectionDetailsBodyContainer
  from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import CollectionDetailsHeaderContainer
  from '../../containers/CollectionDetailsHeaderContainer/CollectionDetailsHeaderContainer'
import CollectionDetailsHighlightsContainer
  from '../../containers/CollectionDetailsHighlightsContainer/CollectionDetailsHighlightsContainer'
import CollectionResultsHeaderContainer
  from '../../containers/CollectionResultsHeaderContainer/CollectionResultsHeaderContainer'
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
import GranuleResultsHighlightsContainer
  from '../../containers/GranuleResultsHighlightsContainer/GranuleResultsHighlightsContainer'
import GranuleFiltersPanelContainer
  from '../../containers/GranuleFiltersPanelContainer/GranuleFiltersPanelContainer'
import AdvancedSearchModalContainer
  from '../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer'
import RelatedUrlsModalContainer
  from '../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer'
import SearchPanelsContainer
  from '../../containers/SearchPanelsContainer/SearchPanelsContainer'
import SearchFormContainer
  from '../../containers/SearchFormContainer/SearchFormContainer'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'

import FacetsContainer from '../../containers/FacetsContainer/FacetsContainer'
import SidebarSection from '../../components/Sidebar/SidebarSection'

import actions from '../../actions'
import advancedSearchFields from '../../data/advancedSearchFields'

const mapDispatchToProps = dispatch => ({
  onMasterOverlayHeightChange:
    newHeight => dispatch(actions.masterOverlayPanelResize(newHeight)),
  onUpdateAdvancedSearch:
    values => dispatch(actions.updateAdvancedSearch(values))
})

export class Search extends Component {
  componentDidMount() {
    const { onMasterOverlayHeightChange } = this.props

    // Set the height of the master overlay to 500px by default
    const panelHeight = window.innerHeight ? window.innerHeight / 2 : 500
    onMasterOverlayHeightChange(panelHeight)
  }

  render() {
    const {
      match,
      onUpdateAdvancedSearch
    } = this.props
    const { path } = match

    return (
      <div className="route-wrapper route-wrapper--search search">
        <SidebarContainer
          panels={<SearchPanelsContainer />}
        >
          <SearchFormContainer />
          <SidebarSection>
            <Switch>
              <Route exact path={`${path}/granules/collection-details`}>
                <GranuleResultsHighlightsContainer />
              </Route>
              <Route exact path={`${path}/granules`}>
                <CollectionDetailsHighlightsContainer />
              </Route>
              <Route exact path={`${path}/granules/granule-details`}>
                <CollectionDetailsHighlightsContainer />
              </Route>
              <Route path={path}>
                <FacetsContainer />
              </Route>
            </Switch>
          </SidebarSection>
        </SidebarContainer>
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            <div className="route-wrapper__header-primary">
              <SecondaryToolbarContainer />
            </div>
          </header>
          <Switch>
            <Route exact path={`${path}/granules`}>
              <GranuleFiltersPanelContainer />
            </Route>
          </Switch>
          <RelatedUrlsModalContainer />
          <FacetsModalContainer />
          <AdvancedSearchModalContainer
            fields={advancedSearchFields}
            onUpdateAdvancedSearch={onUpdateAdvancedSearch}
          />
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired,
  onUpdateAdvancedSearch: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Search)
)
