import React, {
  useState,
  lazy,
  Suspense,
  useEffect
} from 'react'
import { Route, Routes } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import { FaFilter, FaMap } from 'react-icons/fa'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import AdvancedSearchModalContainer
  from '../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer'
import FacetsContainer from '../../containers/FacetsContainer/FacetsContainer'
import FacetsModalContainer from '../../containers/FacetsModalContainer/FacetsModalContainer'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import SearchPanelsContainer from '../../containers/SearchPanelsContainer/SearchPanelsContainer'
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'

import RelatedUrlsModal from '../../components/CollectionDetails/RelatedUrlsModal'
import SearchSidebarHeader from '../../components/SearchSidebar/SearchSidebarHeader'
import SidebarSection from '../../components/Sidebar/SidebarSection'
import SidebarFiltersItem from '../../components/Sidebar/SidebarFiltersItem'
import SidebarFiltersList from '../../components/Sidebar/SidebarFiltersList'
import Spinner from '../../components/Spinner/Spinner'

import advancedSearchFields from '../../data/advancedSearchFields'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { routes } from '../../constants/routes'

const EdscMapContainer = lazy(() => import('../../containers/MapContainer/MapContainer'))
const CollectionDetailsHighlights = lazy(() => import('../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'))
const GranuleResultsHighlights = lazy(() => import('../../components/GranuleResultsHighlights/GranuleResultsHighlights'))
const GranuleFiltersContainer = lazy(() => import('../../containers/GranuleFiltersContainer/GranuleFiltersContainer'))

/**
 * The Search route component
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collectionQuery - Collection query state
 * @param {Object} props.match - Router match state
 * @param {Function} props.onChangeQuery - Callback to change the query
 * @param {Function} props.onUpdateAdvancedSearch - Callback to update the advanced search state
 */
export const Search = () => {
  const [granuleFiltersNeedsReset, setGranuleFiltersNeedReset] = useState(false)

  const {
    changeQuery,
    onSearchLoaded
  } = useEdscStore((state) => ({
    changeQuery: state.query.changeQuery,
    onSearchLoaded: state.ui.tour.onSearchLoaded
  }))
  const collectionQuery = useEdscStore(getCollectionsQuery)

  useEffect(() => {
    onSearchLoaded()

    document.querySelector('.root__app').classList.add('root__app--fixed-footer')

    return () => {
      document.querySelector('.root__app').classList.remove('root__app--fixed-footer')
    }
  }, [])

  const {
    hasGranulesOrCwic = false,
    onlyEosdisCollections
  } = collectionQuery

  const isHasNoGranulesChecked = !hasGranulesOrCwic
  const isEosdisChecked = onlyEosdisCollections || false

  const handleCheckboxCheck = (event) => {
    const { target } = event
    const { checked, id } = target

    const collection = {}
    if (id === 'input__non-eosdis') {
      if (!checked) collection.onlyEosdisCollections = undefined
      if (checked) collection.onlyEosdisCollections = true
    }

    if (id === 'input__only-granules') {
      if (!checked) collection.hasGranulesOrCwic = true
      if (checked) collection.hasGranulesOrCwic = undefined
    }

    changeQuery({
      collection
    })
  }

  const granuleFiltersSidebar = (
    <SidebarSection
      sectionTitle="Filter Granules"
      titleIcon={FaFilter}
      headerAction={
        {
          title: 'Clear Filters',
          onClick: () => {
            setGranuleFiltersNeedReset(true)
          }
        }
      }
    >
      <Suspense fallback={<div />}>
        <GranuleFiltersContainer
          granuleFiltersNeedsReset={granuleFiltersNeedsReset}
          setGranuleFiltersNeedReset={setGranuleFiltersNeedReset}
        />
      </Suspense>
    </SidebarSection>
  )

  return (
    <>
      <div className="route-wrapper route-wrapper--search search">
        <SidebarContainer
          headerChildren={(
            <SearchSidebarHeader />
          )}
          panels={<SearchPanelsContainer />}
        >
          <Routes>
            <Route
              path={routes.COLLECTION_DETAILS.replace(routes.SEARCH, '')}
              element={
                (
                  <SidebarSection
                    sectionTitle="Granules"
                    titleIcon={FaMap}
                  >
                    <Suspense fallback={<div />}>
                      <GranuleResultsHighlights />
                    </Suspense>
                  </SidebarSection>
                )
              }
            />
            <Route
              path={routes.GRANULES.replace(routes.SEARCH, '')}
              element={granuleFiltersSidebar}
            />
            <Route
              path={routes.GRANULE_DETAILS.replace(routes.SEARCH, '')}
              element={
                (
                  <SidebarSection
                    sectionTitle="Collection Details"
                    titleIcon={AlertInformation}
                  >
                    <Suspense fallback={<div />}>
                      <CollectionDetailsHighlights />
                    </Suspense>
                  </SidebarSection>
                )
              }
            />
            <Route
              path={routes.GRANULE_SUBSCRIPTIONS.replace(routes.SEARCH, '')}
              element={granuleFiltersSidebar}
            />
            <Route
              path="/*"
              element={
                (
                  <div className="sidebar-section-body">
                    <SidebarSection
                      sectionTitle="Filter Collections"
                      titleIcon={FaFilter}
                    >
                      <SidebarFiltersList>
                        <SidebarFiltersItem
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
                                  data-testid="input_only-granules"
                                  label="Include collections without granules"
                                  onChange={(event) => handleCheckboxCheck(event)}
                                />
                              </PortalFeatureContainer>
                              <PortalFeatureContainer nonEosdisCheckbox>
                                <Form.Check
                                  checked={isEosdisChecked}
                                  id="input__non-eosdis"
                                  data-testid="input_non-eosdis"
                                  label="Include only EOSDIS collections"
                                  onChange={(event) => handleCheckboxCheck(event)}
                                />
                              </PortalFeatureContainer>
                            </Form.Group>
                          </SidebarFiltersItem>
                        </PortalFeatureContainer>
                      </SidebarFiltersList>
                    </SidebarSection>
                  </div>
                )
              }
            />
          </Routes>
        </SidebarContainer>
        <div className="route-wrapper__content route-wrapper__content--dark">
          <RelatedUrlsModal />
          <FacetsModalContainer />
          <PortalFeatureContainer advancedSearch>
            <AdvancedSearchModalContainer
              fields={advancedSearchFields}
            />
          </PortalFeatureContainer>
        </div>
      </div>

      <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--white spinner--small" />}>
        <EdscMapContainer />
      </Suspense>
    </>
  )
}

export default Search
