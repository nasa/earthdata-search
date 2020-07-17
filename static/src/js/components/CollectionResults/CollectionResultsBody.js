import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import CollectionResultsList from './CollectionResultsList'
import CollectionResultsTable from './CollectionResultsTable'
import { formatCollectionList } from '../../util/formatCollectionList'


import './CollectionResultsBody.scss'

/**
 * Renders CollectionResultsBody.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.browser - Browser information.
 * @param {Array} props.collections - Collections passed from redux store.
 * @param {Function} props.loadNextPage - Callback to load the next page of results.
 * @param {Function} props.onAddProjectCollection - Callback to add a collection to a project.
 * @param {Function} props.onRemoveCollectionFromProject - Callback to remove a collection to a project.
 * @param {Function} props.onViewCollectionGranules - Callback to show collection granules route.
 * @param {Function} props.onViewCollectionDetails - Callback to show collection details route.
 * @param {String} props.panelView - The current active view.
 */
const CollectionResultsBody = ({
  browser,
  collections,
  loadNextPage,
  panelView,
  portal,
  projectIds,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionGranules,
  onViewCollectionDetails
}) => {
  const {
    allIds: collectionIds,
    hits: collectionHits,
    isLoading
  } = collections

  const collectionList = useMemo(() => formatCollectionList(collections, projectIds, browser),
    [collectionIds, projectIds])

  const [visibleMiddleIndex, setVisibleMiddleIndex] = useState(null)

  // Determine if another page is available by checking if there are more collections to load,
  // or if we have no collections and collections are loading. This controls whether or not the
  // "collections loading" item or the skeleton is displayed.
  const moreCollectionsToLoad = !!(
    collectionList
    && collectionList.length
    && collectionList.length < collectionHits
  )
  const loadingFirstCollections = !!(isLoading && collectionList.length === 0)
  const hasNextPage = moreCollectionsToLoad || loadingFirstCollections

  // If a next page is available, add an empty item to the lists for the loading indicator.
  const itemCount = hasNextPage ? collectionList.length + 1 : collectionList.length

  // If collections are currently loading, pass an empty function, otherwise load more collections.
  const loadMoreItems = isLoading ? () => {} : loadNextPage

  // Callback to check if a particular collection has loaded.
  const isItemLoaded = index => !hasNextPage || index < collectionList.length

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
          browser={browser}
          collections={collectionList}
          onAddProjectCollection={onAddProjectCollection}
          onRemoveCollectionFromProject={onRemoveCollectionFromProject}
          onViewCollectionGranules={onViewCollectionGranules}
          onViewCollectionDetails={onViewCollectionDetails}
          loadNextPage={loadNextPage}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
          portal={portal}
        />
      </CSSTransition>
      <CSSTransition
        in={panelView === 'table'}
        timeout={200}
        classNames="collection-results-body__view"
        unmountOnExit
      >
        <CollectionResultsTable
          visibleMiddleIndex={visibleMiddleIndex}
          collections={collectionList}
          onViewCollectionGranules={onViewCollectionGranules}
          onAddProjectCollection={onAddProjectCollection}
          onRemoveCollectionFromProject={onRemoveCollectionFromProject}
          onViewCollectionDetails={onViewCollectionDetails}
          loadNextPage={loadNextPage}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
          portal={portal}
        />
      </CSSTransition>
    </div>
  )
}

CollectionResultsBody.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  loadNextPage: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default CollectionResultsBody
