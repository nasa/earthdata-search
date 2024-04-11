import React from 'react'
import PropTypes from 'prop-types'

import './EDSCModalOverlay.scss'

export const EDSCModalOverlay = ({
  children
}) => {
  if (!children) return null

  return (
    <div className="edsc-modal-overlay">
      {children}
    </div>
  )
}

EDSCModalOverlay.defaultProps = {
  children: null
}

EDSCModalOverlay.propTypes = {
  children: PropTypes.node
}

export default EDSCModalOverlay
