import React from 'react'
import PropTypes from 'prop-types'

import GranuleResultsList from './GranuleResultsList'

import './GranuleResultsBody.scss'

/**
 * Renders GranuleResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granules - Granules passed from redux store.
 */
const GranuleResultsBody = ({
  collectionId,
  excludedGranuleIds,
  focusedGranule,
  granules,
  isCwic,
  location,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  pageNum,
  scrollContainer,
  waypointEnter
}) => (
  <div className="granule-results-body">
    <GranuleResultsList
      collectionId={collectionId}
      excludedGranuleIds={excludedGranuleIds}
      focusedGranule={focusedGranule}
      granules={granules}
      isCwic={isCwic}
      location={location}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onMetricsDataAccess={onMetricsDataAccess}
      pageNum={pageNum}
      scrollContainer={scrollContainer}
      waypointEnter={waypointEnter}
    />
  </div>
)

GranuleResultsBody.defaultProps = {
  scrollContainer: null
}

GranuleResultsBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  isCwic: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  scrollContainer: PropTypes.instanceOf(Element),
  waypointEnter: PropTypes.func.isRequired
}

export default GranuleResultsBody
