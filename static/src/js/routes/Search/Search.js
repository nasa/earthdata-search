import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import AdvancedSearchModalContainer
  from '../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer'
import CollectionDetailsHighlightsContainer
  from '../../containers/CollectionDetailsHighlightsContainer/CollectionDetailsHighlightsContainer'
import FacetsContainer from '../../containers/FacetsContainer/FacetsContainer'
import FacetsModalContainer
  from '../../containers/FacetsModalContainer/FacetsModalContainer'
import GranuleResultsHighlightsContainer
  from '../../containers/GranuleResultsHighlightsContainer/GranuleResultsHighlightsContainer'
import GranuleFiltersPanelContainer
  from '../../containers/GranuleFiltersPanelContainer/GranuleFiltersPanelContainer'
import RelatedUrlsModalContainer
  from '../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer'
import SearchPanelsContainer
  from '../../containers/SearchPanelsContainer/SearchPanelsContainer'
import SearchSidebarHeaderContainer
  from '../../containers/SearchSidebarHeaderContainer/SearchSidebarHeaderContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SidebarSection from '../../components/Sidebar/SidebarSection'

import actions from '../../actions'
import advancedSearchFields from '../../data/advancedSearchFields'

const mapDispatchToProps = dispatch => ({
  onUpdateAdvancedSearch:
    values => dispatch(actions.updateAdvancedSearch(values)),
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

export const Search = ({
  match,
  onUpdateAdvancedSearch
}) => {
  const { path } = match

  return (
    <div className="route-wrapper route-wrapper--search search">
      <SidebarContainer
        headerChildren={(
          <SearchSidebarHeaderContainer />
        )}
        panels={<SearchPanelsContainer />}
      >
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

Search.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onUpdateAdvancedSearch: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Search)
)
