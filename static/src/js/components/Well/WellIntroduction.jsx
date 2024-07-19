import React from 'react'
import PropTypes from 'prop-types'

export const WellIntroduction = ({
  children
}) => (
  <div className="well__introduction">
    {children}
  </div>
)

WellIntroduction.defaultProps = {
  children: null
}

WellIntroduction.propTypes = {
  children: PropTypes.node
}

export default WellIntroduction
