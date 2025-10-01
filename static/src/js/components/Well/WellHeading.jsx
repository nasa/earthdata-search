import React from 'react'
import PropTypes from 'prop-types'

export const WellSection = ({
  children = null
}) => (
  <h2 className="well__heading">
    {children}
  </h2>
)

WellSection.propTypes = {
  children: PropTypes.node
}

export default WellSection
