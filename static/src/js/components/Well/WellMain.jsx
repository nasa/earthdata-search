import React from 'react'
import PropTypes from 'prop-types'

export const WellMain = ({
  children
}) => (
  <div className="well__main">
    {children}
  </div>
)

WellMain.defaultProps = {
  children: null
}

WellMain.propTypes = {
  children: PropTypes.node
}

export default WellMain
