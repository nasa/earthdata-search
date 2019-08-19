import React from 'react'
import PropTypes from 'prop-types'

import './GranuleFiltersHeader.scss'

/**
 * Renders GranuleFiltersHeader.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.datasetId - The title of the focused collection.
 */
export const GranuleFiltersHeader = ({
  datasetId
}) => (
  <div className="granule-filters-header">
    <i className="fa fa-filter" />
    <h2 className="granule-filters-header__primary">Granule Filters</h2>
    <span className="granule-filters-header__secondary">{datasetId}</span>
  </div>
)

GranuleFiltersHeader.defaultProps = {
  datasetId: ''
}

GranuleFiltersHeader.propTypes = {
  datasetId: PropTypes.string
}

export default GranuleFiltersHeader
