import React from 'react'
import PropTypes from 'prop-types'

const MasterOverlayPanel = (props) => {
  const { children, panelHeight } = props

  return (
    <div className="search__panel" style={{ height: `${panelHeight}px`, willChange: 'height' }}>
      {children}
    </div>
  )
}

MasterOverlayPanel.propTypes = {
  children: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired
}

export default MasterOverlayPanel
