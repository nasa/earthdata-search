import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders GranuleFiltersBody.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.granuleFiltersForm - The granule filters form.
 */
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
