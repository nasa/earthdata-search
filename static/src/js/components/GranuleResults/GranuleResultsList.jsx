import React from 'react'
import { PropTypes } from 'prop-types'
import AutoSizer from 'react-virtualized-auto-sizer'

import { locationPropType } from '../../util/propTypes/location'

import GranuleResultsListBody from './GranuleResultsListBody'

import './GranuleResultsList.scss'

/**
 * Renders GranuleResultsList.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {Object} props.collectionQuerySpatial - The spatial for the collection query
 * @param {Object} props.collectionTags - The tags for the focused collection
 * @param {Object} props.directDistributionInformation - The direct distribution information.
 * @param {Array} props.excludedGranuleIds - List of excluded granule IDs.
 * @param {String} props.focusedGranuleId - The currently focused granule ID.
 * @param {Object} props.generateNotebook - The generateNotebook state from the redux store.
 * @param {Array} props.granules - List of formatted granule.
 * @param {Boolean} props.isOpenSearch - Flag designating CWIC collections.
 * @param {Boolean} props.isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Function} props.isGranuleInProject - Function to detirmine if the granule is in the project.
 * @param {Function} props.isItemLoaded - Callback to detirmine if a granule has been loaded.
 * @param {Number} props.itemCount - Number of total granule list itmes.
 * @param {Function} props.loadMoreItems - Callback to load more granules.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} props.onGenerateNotebook - Callback to generate a notebook.
 * @param {Function} props.onMetricsDataAccess - Callback to record data access metrics.
 * @param {Array} props.readableGranuleName - The readableGranuleName filter value
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the visible middle index.
 * @param {Number} props.visibleMiddleIndex - The current visible middle index.
 */
export const GranuleResultsList = ({
  collectionId,
  collectionQuerySpatial,
  collectionTags,
  directDistributionInformation,
  excludedGranuleIds,
  focusedGranuleId,
  generateNotebook,
  granules,
  isCollectionInProject,
  isOpenSearch,
  isGranuleInProject,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onGenerateNotebook,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsAddGranuleProject,
  onMetricsDataAccess,
  readableGranuleName,
  setVisibleMiddleIndex,
  visibleMiddleIndex
}) => (
  <div className="granule-results-list">
    <AutoSizer style={
      {
        position: 'relative',
        height: '100%',
        width: '100%'
      }
    }
    >
      {
        ({ height, width }) => (
          <GranuleResultsListBody
            collectionId={collectionId}
            collectionQuerySpatial={collectionQuerySpatial}
            collectionTags={collectionTags}
            directDistributionInformation={directDistributionInformation}
            excludedGranuleIds={excludedGranuleIds}
            focusedGranuleId={focusedGranuleId}
            generateNotebook={generateNotebook}
            granules={granules}
            height={height}
            isCollectionInProject={isCollectionInProject}
            isOpenSearch={isOpenSearch}
            isGranuleInProject={isGranuleInProject}
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
            location={location}
            onExcludeGranule={onExcludeGranule}
            onFocusedGranuleChange={onFocusedGranuleChange}
            onGenerateNotebook={onGenerateNotebook}
            onMetricsAddGranuleProject={onMetricsAddGranuleProject}
            onMetricsDataAccess={onMetricsDataAccess}
            readableGranuleName={readableGranuleName}
            setVisibleMiddleIndex={setVisibleMiddleIndex}
            visibleMiddleIndex={visibleMiddleIndex}
            width={width}
          />
        )
      }
    </AutoSizer>
  </div>
)

GranuleResultsList.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

GranuleResultsList.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collectionQuerySpatial: PropTypes.shape({}).isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  isOpenSearch: PropTypes.bool.isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  location: locationPropType.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  readableGranuleName: PropTypes.arrayOf(PropTypes.string).isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default GranuleResultsList
