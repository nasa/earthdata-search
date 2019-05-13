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
  granules,
  pageNum,
  waypointEnter,
  onExcludeGranule
}) => (
  <div className="granule-results-body__inner">
    <GranuleResultsList
      collectionId={collectionId}
      excludedGranuleIds={excludedGranuleIds}
      granules={granules}
      pageNum={pageNum}
      waypointEnter={waypointEnter}
      onExcludeGranule={onExcludeGranule}
    />
  </div>
)

GranuleResultsBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  granules: PropTypes.shape({}).isRequired,
  pageNum: PropTypes.number.isRequired,
  waypointEnter: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired
}

export default GranuleResultsBody
