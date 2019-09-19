import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

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
  pageNum,
  location,
  waypointEnter,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess
}) => (
  <SimpleBar className="granule-results-body">
    <GranuleResultsList
      collectionId={collectionId}
      excludedGranuleIds={excludedGranuleIds}
      focusedGranule={focusedGranule}
      granules={granules}
      isCwic={isCwic}
      pageNum={pageNum}
      location={location}
      waypointEnter={waypointEnter}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onMetricsDataAccess={onMetricsDataAccess}
    />
  </SimpleBar>
)

GranuleResultsBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  isCwic: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  location: PropTypes.shape({}).isRequired,
  waypointEnter: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsBody
