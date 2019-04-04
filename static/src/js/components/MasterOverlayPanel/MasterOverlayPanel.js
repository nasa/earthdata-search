import React from 'react'
import PropTypes from 'prop-types'

import './MasterOverlayPanel.scss'

const MasterOverlayPanel = (props) => {
  const { children, panelHeight } = props

  return (
    <div className="master-overlay-panel" style={{ height: `${panelHeight}px` }}>
      {children}
    </div>
  )
}

MasterOverlayPanel.propTypes = {
  children: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired
}

export default MasterOverlayPanel
