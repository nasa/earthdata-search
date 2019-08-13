import React from 'react'
import PropTypes from 'prop-types'

export const GranuleFiltersBody = ({
  granuleFiltersForm
}) => (
  <div className="granule-filters-body">
    {granuleFiltersForm}
  </div>
)

GranuleFiltersBody.propTypes = {
  granuleFiltersForm: PropTypes.node.isRequired
}

export default GranuleFiltersBody
