import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { FaDoorOpen } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

import { formatCollectionList } from '../../util/formatCollectionList'
import { isDefaultPortal } from '../../util/portals'

import CollectionResultsList from './CollectionResultsList'
import CollectionResultsTable from './CollectionResultsTable'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'

import './CollectionResultsBody.scss'

/**
 * Renders CollectionResultsBody.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.collections - Collections passed from redux store.
 * @param {Function} props.loadNextPage - Callback to load the next page of results.
 * @param {Function} props.onMetricsAddCollectionProject - Metrics callback for adding a collection to project event.
 * @param {Function} props.onViewCollectionGranules - Callback to show collection granules route.
 * @param {Function} props.onViewCollectionDetails - Callback to show collection details route.
 * @param {String} props.panelView - The current active view.
 */
const CollectionResultsBody = ({
  collectionsMetadata,
  collectionsSearch,
  loadNextPage,
  onMetricsAddCollectionProject,
  onViewCollectionDetails,
  onViewCollectionGranules,
  panelView
}) => {
  const {
    allIds: collectionIds,
    hits: collectionHits,
    isLoading,
    isLoaded
  } = collectionsSearch

  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

  const collectionList = useMemo(() => formatCollectionList(
    collectionsSearch,
    collectionsMetadata,
    projectCollectionIds
  ), [
    isLoading,
    collectionsMetadata,
    collectionIds,
    projectCollectionIds
  ])

  const [visibleMiddleIndex, setVisibleMiddleIndex] = useState(null)

  const portal = useEdscStore((state) => state.portal)
  const location = useLocation()

  // Determine if another page is available by checking if there are more collections to load,
  // or if we have no collections and collections are loading. This controls whether or not the
  // "collections loading" item or the skeleton is displayed.
  const moreCollectionsToLoad = !!(
    collectionList
    && collectionList.length
    && collectionList.length < collectionHits
  )

  const noCollectionRequestStarted = !isLoading && !isLoaded

  // Show a skeleton while a request is happening
  const isCollectionsLoading = isLoading && collectionList.length === 0
  const loadingFirstCollections = noCollectionRequestStarted || isCollectionsLoading

  // Show a skeleton when items are loading
  const hasNextPage = moreCollectionsToLoad || loadingFirstCollections

  // If a next page is available, add an empty item to the lists for the loading indicator.
  const itemCount = hasNextPage ? collectionList.length + 1 : collectionList.length

  // If collections are currently loading, pass an empty function, otherwise load more collections.
  const loadMoreItems = isLoading || loadingFirstCollections ? () => {} : loadNextPage

  // Callback to check if a particular collection has loaded.
  const isItemLoaded = (index) => !hasNextPage || index < collectionList.length

  const {
    portalId,
    title = portalId
  } = portal

  const { primary: primaryPortalTitle = portalId } = title

  return (
    <div className="collection-results-body">
      <CSSTransition
        in={panelView === 'list'}
        timeout={200}
        classNames="collection-results-body__view"
        unmountOnExit
      >
        <CollectionResultsList
          visibleMiddleIndex={visibleMiddleIndex}
          collectionsMetadata={collectionList}
          onViewCollectionGranules={onViewCollectionGranules}
          onViewCollectionDetails={onViewCollectionDetails}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
          onMetricsAddCollectionProject={onMetricsAddCollectionProject}
        />
      </CSSTransition>
      <CSSTransition
        in={panelView === 'table'}
        timeout={200}
        classNames="collection-results-body__view"
        unmountOnExit
      >
        <CollectionResultsTable
          collectionsMetadata={collectionList}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          onMetricsAddCollectionProject={onMetricsAddCollectionProject}
          onViewCollectionDetails={onViewCollectionDetails}
          onViewCollectionGranules={onViewCollectionGranules}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          visibleMiddleIndex={visibleMiddleIndex}
        />
      </CSSTransition>
      {
        !isDefaultPortal(portalId) && (
          <div className="collection-results-body__portal-escape-wrapper">
            <PortalLinkContainer
              className="collection-results-body__portal-escape"
              type="button"
              newPortal={{}}
              to={location}
              updatePath
              icon={FaDoorOpen}
            >
              Looking for more collections?
              {' '}
              <span className="collection-results-body__portal-escape-emphasis">
                Leave
                {' '}
                the
                {' '}
                {primaryPortalTitle}
                {' '}
                Portal
              </span>
            </PortalLinkContainer>
          </div>
        )
      }
    </div>
  )
}

CollectionResultsBody.propTypes = {
  collectionsMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    hits: PropTypes.number,
    isLoading: PropTypes.bool,
    isLoaded: PropTypes.bool
  }).isRequired,
  loadNextPage: PropTypes.func.isRequired,
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default CollectionResultsBody
