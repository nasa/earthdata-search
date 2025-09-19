import React from 'react'
import PropTypes from 'prop-types'

export const WellMain = ({
  children = null
}) => (
  <div className="well__main">
    {children}
  </div>
)

WellMain.propTypes = {
  children: PropTypes.node
}

export default WellMain
