import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { Form } from 'react-bootstrap'
import {
  FaMap,
  FaFilter,
  FaInfoCircle
} from 'react-icons/fa'

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
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import SidebarFiltersItem from '../../components/Sidebar/SidebarFiltersItem'
import SidebarFiltersList from '../../components/Sidebar/SidebarFiltersList'

import actions from '../../actions'
import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import advancedSearchFields from '../../data/advancedSearchFields'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

const mapDispatchToProps = (dispatch) => ({
  onUpdateAdvancedSearch:
    (values) => dispatch(actions.updateAdvancedSearch(values)),
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query)),
  onMetricsCollectionSortChange:
    (data) => dispatch(metricsCollectionSortChange(data))
})

const mapStateToProps = (state) => ({
  collectionQuery: state.query.collection
})

/**
 * Search route components
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collectionQuery - Collection query state
 * @param {Object} props.match - Router match state
 * @param {Function} props.onUpdateAdvancedSearch - Callback to update the advanced search state
 * @param {Function} props.onChangeQuery - Callback to change the query
 */
export const Search = ({
  collectionQuery,
  match,
  onUpdateAdvancedSearch,
  onChangeQuery
}) => {
  const { path } = match
  const [granuleFiltersNeedsReset, setGranuleFiltersNeedReset] = useState(false)

  const { hasGranulesOrCwic = false, tagKey } = collectionQuery
  const isHasNoGranulesChecked = !hasGranulesOrCwic

  const { eosdisTagKey } = getApplicationConfig()
  const isEosdisChecked = tagKey === eosdisTagKey

  const handleCheckboxCheck = (event) => {
    const { target } = event
    const { checked, id } = target

    const collection = {}
    if (id === 'input__non-eosdis') {
      if (!checked) collection.tagKey = undefined
      if (checked) collection.tagKey = getApplicationConfig().eosdisTagKey
    }

    if (id === 'input__only-granules') {
      if (!checked) collection.hasGranulesOrCwic = true
      if (checked) collection.hasGranulesOrCwic = undefined
    }

    onChangeQuery({
      collection
    })
  }

  return (
    <div className="route-wrapper route-wrapper--search search">
      <SidebarContainer
        headerChildren={(
          <SearchSidebarHeaderContainer />
        )}
        panels={<SearchPanelsContainer />}
      >
        <Switch>
          <Route exact path={`${path}/granules/collection-details`}>
            <SidebarSection
              sectionTitle="Granules"
              titleIcon={FaMap}
            >
              <GranuleResultsHighlightsContainer />
            </SidebarSection>
          </Route>
          <Route exact path={`${path}/granules`}>
            <SidebarSection
              sectionTitle="Filter Granules"
              titleIcon={FaFilter}
              headerAction={{
                title: 'Clear Filters',
                onClick: () => {
                  setGranuleFiltersNeedReset(true)
                }
              }}
            >
              <GranuleFiltersContainer
                granuleFiltersNeedsReset={granuleFiltersNeedsReset}
                setGranuleFiltersNeedReset={setGranuleFiltersNeedReset}
              />
            </SidebarSection>
          </Route>
          <Route exact path={`${path}/granules/granule-details`}>
            <SidebarSection
              sectionTitle="Collection Details"
              titleIcon={FaInfoCircle}
            >
              <CollectionDetailsHighlightsContainer />
            </SidebarSection>
          </Route>
          <Route exact path={`${path}/granules/subscriptions`}>
            <SidebarSection
              sectionTitle="Collection Details"
              titleIcon={FaInfoCircle}
            >
              <CollectionDetailsHighlightsContainer />
            </SidebarSection>
          </Route>
          <Route path={path}>
            <SidebarSection
              sectionTitle="Filter Collections"
              titleIcon={FaFilter}
            >
              <SidebarFiltersList>
                <SidebarFiltersItem
                  heading="Categories"
                  hasPadding={false}
                >
                  <FacetsContainer />
                </SidebarFiltersItem>
                <PortalFeatureContainer
                  onlyGranulesCheckbox
                  nonEosdisCheckbox
                >
                  <SidebarFiltersItem
                    heading="Additional Filters"
                  >
                    <Form.Group controlId="collection-filters__has-no-granules">
                      <PortalFeatureContainer onlyGranulesCheckbox>
                        <Form.Check
                          checked={isHasNoGranulesChecked}
                          id="input__only-granules"
                          data-test-id="input_only-granules"
                          label="Include collections without granules"
                          onChange={(event) => handleCheckboxCheck(event)}
                        />
                      </PortalFeatureContainer>
                      <PortalFeatureContainer nonEosdisCheckbox>
                        <Form.Check
                          checked={isEosdisChecked}
                          id="input__non-eosdis"
                          data-test-id="input_non-eosdis"
                          label="Include only EOSDIS collections"
                          onChange={(event) => handleCheckboxCheck(event)}
                        />
                      </PortalFeatureContainer>
                    </Form.Group>
                  </SidebarFiltersItem>
                </PortalFeatureContainer>
              </SidebarFiltersList>
            </SidebarSection>
          </Route>
        </Switch>
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
  collectionQuery: PropTypes.shape({
    hasGranulesOrCwic: PropTypes.bool,
    tagKey: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  onUpdateAdvancedSearch: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Search)
)
