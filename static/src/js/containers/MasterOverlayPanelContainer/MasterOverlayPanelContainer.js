import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import MasterOverlayPanel from '../../components/MasterOverlayPanel/MasterOverlayPanel'

const mapStateToProps = state => ({
  panelHeight: state.ui.masterOverlayPanel.height
})

const MasterOverlayPanelContainer = (props) => {
  const { children, panelHeight } = props
  return (
    <MasterOverlayPanel panelHeight={panelHeight}>
      {children}
    </MasterOverlayPanel>
  )
}

MasterOverlayPanelContainer.propTypes = {
  children: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired
}

export default connect(mapStateToProps)(MasterOverlayPanelContainer)
