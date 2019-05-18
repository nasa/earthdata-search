import React from 'react'
import PropTypes from 'prop-types'

import GranuleResultsList from './GranuleResultsList'

import './GranuleResultsBody.scss'

/**
 * Renders GranuleResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granules - Granules passed from redux store.
 */
const GranuleResultsBody = ({ granules, pageNum, waypointEnter }) => (
  <div className="granule-results-body__inner">
    <GranuleResultsList
      granules={granules}
      pageNum={pageNum}
      waypointEnter={waypointEnter}
    />
  </div>
)

GranuleResultsBody.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  pageNum: PropTypes.number.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default GranuleResultsBody
