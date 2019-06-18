import React from 'react'
import PropTypes from 'prop-types'

export const WellFooter = ({
  children
}) => (
  <div className="well__footer">
    {children}
  </div>
)

WellFooter.defaultProps = {
  children: null
}

WellFooter.propTypes = {
  children: PropTypes.node
}

export default WellFooter
