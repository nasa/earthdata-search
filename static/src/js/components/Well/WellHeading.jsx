import React from 'react'
import PropTypes from 'prop-types'

export const WellSection = ({ children }) => (
  <h2 className="well__heading">
    {children}
  </h2>
)

WellSection.defaultProps = {
  children: null
}

WellSection.propTypes = {
  children: PropTypes.node
}

export default WellSection
