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
import GranuleFiltersContainer
  from '../../containers/GranuleFiltersContainer/GranuleFiltersContainer'
import RelatedUrlsModalContainer
  from '../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer'
import SearchPanelsContainer
  from '../../containers/SearchPanelsContainer/SearchPanelsContainer'
import SearchSidebarHeaderContainer
  from '../../containers/SearchSidebarHeaderContainer/SearchSidebarHeaderContainer'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SidebarSection from '../../components/Sidebar/SidebarSection'

import actions from '../../actions'
import advancedSearchFields from '../../data/advancedSearchFields'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

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
              <GranuleFiltersContainer />
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
        <RelatedUrlsModalContainer />
        <FacetsModalContainer />
        <PortalFeatureContainer advancedSearch>
          <AdvancedSearchModalContainer
            fields={advancedSearchFields}
            onUpdateAdvancedSearch={onUpdateAdvancedSearch}
          />
        </PortalFeatureContainer>
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
