import React from 'react'
import PropTypes from 'prop-types'

export const WellSection = ({
  children
}) => (
  <div className="well__section">
    {children}
  </div>
)

WellSection.defaultProps = {
  children: null
}

WellSection.propTypes = {
  children: PropTypes.node
}

export default WellSection
