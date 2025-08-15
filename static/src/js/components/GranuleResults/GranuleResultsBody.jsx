import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import { getGranuleIds } from '../../util/getGranuleIds'
import { formatGranulesList } from '../../util/formatGranulesList'
import { eventEmitter } from '../../events/events'
import { locationPropType } from '../../util/propTypes/location'

import Spinner from '../Spinner/Spinner'
import GranuleResultsList from './GranuleResultsList'
import GranuleResultsTable from './GranuleResultsTable'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getFocusedGranuleId } from '../../zustand/selectors/focusedGranule'

import './GranuleResultsBody.scss'

/**
 * Renders GranuleResultsBody.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The focused collection ID.
 * @param {Object} props.collectionTags - The tags for the focused collection
 * @param {Object} props.directDistributionInformation - The collection direct distribution information.
 * @param {Object} props.generateNotebook - The generateNotebook state from the redux store.
 * @param {Object} props.granuleSearchResults - Granules passed from redux store.
 * @param {Object} props.isOpenSearch - Flag set if the focused collection is a CWIC collection.
 * @param {Function} props.loadNextPage - Callback to load the next page of results.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onGenerateNotebook - Callback to generate a notebook.
 * @param {Function} props.onMetricsAddGranuleProject - Metrics callback for adding granule to project event.
 * @param {Function} props.onMetricsDataAccess - Metrics callback for data access events.
 * @param {Function} props.panelView - The current panel view.
 */
const GranuleResultsBody = ({
  collectionId,
  collectionTags,
  directDistributionInformation,
  generateNotebook,
  granuleSearchResults,
  granulesMetadata,
  isOpenSearch,
  loadNextPage,
  location,
  onGenerateNotebook,
  onMetricsAddGranuleProject,
  onMetricsDataAccess,
  panelView
}) => {
  const focusedGranuleId = useEdscStore(getFocusedGranuleId)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const {
    changeFocusedGranule,
    projectCollections
  } = useEdscStore((state) => ({
    changeFocusedGranule: state.focusedGranule.changeFocusedGranule,
    projectCollections: state.project.collections
  }))

  const [hoveredGranuleId, setHoveredGranuleId] = useState(null)

  // When the map hovers over a granule
  eventEmitter.on(`map.layer.${collectionId}.hoverGranule`, (data) => {
    const { granule: focusedGranule } = data

    if (focusedGranule) {
      const { id: focusedId } = focusedGranule
      setHoveredGranuleId(focusedId)

      return
    }

    setHoveredGranuleId(null)
  })

  const {
    hits: granuleHits,
    loadTime = 0,
    isLoaded,
    isLoading,
    allIds
  } = granuleSearchResults

  const {
    excludedGranuleIds = [],
    readableGranuleName = ['']
  } = granuleQuery

  const granuleIds = getGranuleIds({
    allIds,
    excludedGranuleIds,
    isOpenSearch,
    limit: false
  })

  const {
    byId: projectCollectionsById = {},
    allIds: projectCollectionIds = []
  } = projectCollections

  // If the collection isnt in the project yet the store will not be initialized
  // which means we need to account for defaults here
  const { [collectionId]: projectCollection = {} } = projectCollectionsById
  const { granules: projectCollectionGranules = {} } = projectCollection
  const {
    addedGranuleIds = [],
    removedGranuleIds = []
  } = projectCollectionGranules

  let isCollectionInProject = false
  let allGranulesInProject = false

  // If the collection is in the project
  if (projectCollectionIds.indexOf(collectionId) > -1 && projectCollection) {
    isCollectionInProject = true

    if (!addedGranuleIds.length && !removedGranuleIds.length) {
      // If there are no added granules and no removed granule, then the
      // user has chosen to add the entire collection to the project
      allGranulesInProject = true
    }
  }

  /**
  * Takes the granule id and returns whether or not a granule is in the project.
  * @param {String} granuleId - The granule id.
  * @returns {Boolean}
  */
  const isGranuleInProject = (granuleId) => {
    // If the collection is in the project and the user has removed granules
    if (isCollectionInProject && removedGranuleIds.length) {
      // Check to see if the granuleId provided has been specifically removed
      return removedGranuleIds.indexOf(granuleId) === -1
    }

    // Otherwise, check to see if all granules are in project or that the granuleId
    // provided has been specifically added
    return allGranulesInProject || addedGranuleIds.indexOf(granuleId) > -1
  }

  const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

  const result = useMemo(() => formatGranulesList({
    granuleIds,
    granulesMetadata,
    hoveredGranuleId,
    focusedGranuleId,
    isGranuleInProject,
    isCollectionInProject,
    changeFocusedGranule
  }), [granuleIds, granulesMetadata, focusedGranuleId, hoveredGranuleId])

  const [visibleMiddleIndex, setVisibleMiddleIndex] = useState(null)

  const { granulesList } = result

  // Determine if another page is available by checking if there are more granules to load,
  // or if we have no granules and granules are loading. This controls whether or not the
  // "granules loading" item or the skeleton is displayed.
  const moreGranulesToLoad = !!(
    allIds
    && allIds.length
    && allIds.length < granuleHits
  )

  // When the focused granule info is loading, a request has not been made
  // so we need to force the skeleton
  const noGranuleRequestStarted = !isLoading && !isLoaded

  // Show a skeleton while a request is happening
  const isGranulesLoading = isLoading && granulesList.length === 0

  const loadingFirstGranules = noGranuleRequestStarted || isGranulesLoading

  // Show a skeleton when items are loading
  const hasNextPage = moreGranulesToLoad || loadingFirstGranules

  // If a next page is available, add an empty item to the lists for the loading indicator.
  const itemCount = hasNextPage ? granulesList.length + 1 : granulesList.length

  // If granules are currently loading, pass an empty function, otherwise load more granules.
  const loadMoreItems = isLoading || loadingFirstGranules ? () => {} : loadNextPage

  // Callback to check if a particular granule has loaded.
  const isItemLoaded = (index) => !hasNextPage || index < granulesList.length

  return (
    <div className="granule-results-body">
      <CSSTransition
        in={panelView === 'list'}
        timeout={200}
        classNames="granule-results-body__view"
        unmountOnExit
      >
        <GranuleResultsList
          collectionId={collectionId}
          collectionTags={collectionTags}
          readableGranuleName={readableGranuleName}
          directDistributionInformation={directDistributionInformation}
          excludedGranuleIds={excludedGranuleIds}
          generateNotebook={generateNotebook}
          granules={granulesList}
          isCollectionInProject={isCollectionInProject}
          isOpenSearch={isOpenSearch}
          isGranuleInProject={isGranuleInProject}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          location={location}
          onGenerateNotebook={onGenerateNotebook}
          onMetricsAddGranuleProject={onMetricsAddGranuleProject}
          onMetricsDataAccess={onMetricsDataAccess}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          visibleMiddleIndex={visibleMiddleIndex}
        />
      </CSSTransition>
      <CSSTransition
        in={panelView === 'table'}
        timeout={200}
        classNames="granule-results-body__view"
        unmountOnExit
      >
        <GranuleResultsTable
          collectionId={collectionId}
          collectionTags={collectionTags}
          directDistributionInformation={directDistributionInformation}
          excludedGranuleIds={excludedGranuleIds}
          generateNotebook={generateNotebook}
          granules={granulesList}
          isOpenSearch={isOpenSearch}
          itemCount={itemCount}
          isItemLoaded={isItemLoaded}
          location={location}
          loadMoreItems={loadMoreItems}
          onGenerateNotebook={onGenerateNotebook}
          onMetricsAddGranuleProject={onMetricsAddGranuleProject}
          onMetricsDataAccess={onMetricsDataAccess}
          visibleMiddleIndex={visibleMiddleIndex}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
          isGranuleInProject={isGranuleInProject}
          isCollectionInProject={isCollectionInProject}
        />
      </CSSTransition>
      <div className="granule-results-body__floating-footer">
        <span className="granule-results-body__floating-footer-item">
          Search Time:
          {' '}
          {
            (isLoading && !isLoaded) || loadTime === 0
              ? (
                <span className="granule-results-body__search-time-value">
                  <Spinner
                    type="dots"
                    size="x-tiny"
                  />
                </span>
              )
              : (
                <span
                  className="granule-results-body__search-time-value"
                  data-testid="granule-results-body__search-time-value"
                >
                  {`${loadTimeInSeconds}s`}
                </span>
              )
          }
        </span>
      </div>
    </div>
  )
}

GranuleResultsBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    hits: PropTypes.number,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadTime: PropTypes.number
  }).isRequired,
  granulesMetadata: PropTypes.objectOf(
    PropTypes.shape({
      browseFlag: PropTypes.bool,
      browseUrl: PropTypes.string,
      collectionConceptId: PropTypes.string,
      dayNightFlag: PropTypes.string,
      formattedTemporal: PropTypes.arrayOf(PropTypes.string),
      granuleThumbnail: PropTypes.string,
      id: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          inherited: PropTypes.bool,
          rel: PropTypes.string.isRequired
        })
      ),
      onlineAccessFlag: PropTypes.bool,
      originalFormat: PropTypes.string,
      producerGranuleId: PropTypes.string,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  isOpenSearch: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default GranuleResultsBody
