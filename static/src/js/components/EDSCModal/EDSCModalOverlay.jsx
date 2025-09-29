import React from 'react'
import PropTypes from 'prop-types'

import './EDSCModalOverlay.scss'

export const EDSCModalOverlay = ({
  children = null
}) => {
  if (!children) return null

  return (
    <div className="edsc-modal-overlay">
      {children}
    </div>
  )
}

EDSCModalOverlay.propTypes = {
  children: PropTypes.node
}

export default EDSCModalOverlay
