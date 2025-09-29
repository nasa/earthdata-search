import React from 'react'
import PropTypes from 'prop-types'

export const WellSection = ({
  children = null
}) => (
  <div className="well__section">
    {children}
  </div>
)

WellSection.propTypes = {
  children: PropTypes.node
}

export default WellSection
