import React from 'react'
import PropTypes from 'prop-types'

export const WellIntroduction = ({
  children = null
}) => (
  <div className="well__introduction">
    {children}
  </div>
)

WellIntroduction.propTypes = {
  children: PropTypes.node
}

export default WellIntroduction
