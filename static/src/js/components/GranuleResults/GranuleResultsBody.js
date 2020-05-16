import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import { getGranuleIds } from '../../util/getGranuleIds'
import { formatGranulesList } from '../../util/formatGranulesList'

import Spinner from '../Spinner/Spinner'
import GranuleResultsList from './GranuleResultsList'
import GranuleResultsTable from './GranuleResultsTable'

import './GranuleResultsBody.scss'

/**
 * Renders GranuleResultsBody.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The focused collection ID.
 * @param {Array} props.excludedGranuleIds - An array of excluded granule IDs.
 * @param {String} props.focusedGranule - The focused granule ID.
 * @param {Object} props.granules - Granules passed from redux store.
 * @param {Object} props.isCwic - Flag set if the focused collection is a CWIC collection.
 * @param {Function} props.loadNextPage - Callback to load the next page of results.
 * @param {Object} props.location - Location passed from react-router.
 * @param {Function} props.onExcludeGranule - Callback exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback change the focused granule.
 * @param {Function} props.onMetricsDataAccess - Metrics callback for data access events.
 * @param {Function} props.panelView - The current panel view.
 * @param {Object} props.portal - Portal object passed from the store.
 */
const GranuleResultsBody = ({
  collectionId,
  excludedGranuleIds,
  focusedGranule,
  granules,
  isCwic,
  loadNextPage,
  location,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  panelView,
  portal
}) => {
  const {
    hits: granuleHits,
    loadTime,
    isLoaded,
    isLoading,
    allIds: allGranuleIds
  } = granules

  const granuleIds = getGranuleIds({
    granules,
    excludedGranuleIds,
    isCwic,
    limit: false
  })

  const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

  // eslint-disable-next-line arrow-body-style
  const result = useMemo(() => {
    return formatGranulesList(granules, granuleIds, focusedGranule)
  }, [granules, granuleIds, focusedGranule, excludedGranuleIds])

  const [visibleMiddleIndex, setVisibleMiddleIndex] = useState(null)

  const { granulesList, hasBrowseImagery } = result

  // Determine if another page is available by checking if there are more collections to load,
  // or if we have no collections and collections are loading. This controls whether or not the
  // "collections loading" item or the skeleton is displayed.
  const moreGranulesToLoad = !!(
    allGranuleIds
    && allGranuleIds.length
    && allGranuleIds.length < granuleHits
  )

  // When the focused collection info is loading, a request has not been made
  // so we need to force the skeleton
  const noGranuleRequestStarted = !isLoading && !isLoaded

  // Show a skeleton while a request is happening
  const isGranulesLoading = isLoading && granulesList.length === 0

  const loadingFirstGranules = noGranuleRequestStarted || isGranulesLoading

  // Show a skeleton when items are loading
  const hasNextPage = moreGranulesToLoad || loadingFirstGranules

  // If a next page is available, add an empty item to the lists for the loading indicator.
  const itemCount = hasNextPage ? granulesList.length + 1 : granulesList.length

  // If collections are currently loading, pass an empty function, otherwise load more collections.
  const loadMoreItems = isLoading || loadingFirstGranules ? () => {} : loadNextPage

  // Callback to check if a particular collection has loaded.
  const isItemLoaded = index => !hasNextPage || index < granulesList.length

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
          excludedGranuleIds={excludedGranuleIds}
          focusedGranule={focusedGranule}
          granules={granulesList}
          isCwic={isCwic}
          itemCount={itemCount}
          isItemLoaded={isItemLoaded}
          location={location}
          loadMoreItems={loadMoreItems}
          onExcludeGranule={onExcludeGranule}
          onFocusedGranuleChange={onFocusedGranuleChange}
          onMetricsDataAccess={onMetricsDataAccess}
          portal={portal}
          visibleMiddleIndex={visibleMiddleIndex}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
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
          excludedGranuleIds={excludedGranuleIds}
          focusedGranule={focusedGranule}
          granules={granulesList}
          hasBrowseImagery={hasBrowseImagery}
          isCwic={isCwic}
          itemCount={itemCount}
          isItemLoaded={isItemLoaded}
          location={location}
          loadMoreItems={loadMoreItems}
          onExcludeGranule={onExcludeGranule}
          onFocusedGranuleChange={onFocusedGranuleChange}
          onMetricsDataAccess={onMetricsDataAccess}
          portal={portal}
          visibleMiddleIndex={visibleMiddleIndex}
          setVisibleMiddleIndex={setVisibleMiddleIndex}
        />
      </CSSTransition>
      <div className="granule-results-body__floating-footer">
        <span className="granule-results-body__floating-footer-item">
          Search Time:
          {' '}
          {isGranulesLoading || loadTimeInSeconds === 'NaN'
            ? (
              <span className="granule-results-body__search-time-value">
                <Spinner
                  type="dots"
                  size="x-tiny"
                />
              </span>
            )
            : (
              <span className="granule-results-body__search-time-value">
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
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  isCwic: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  loadNextPage: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default GranuleResultsBody
