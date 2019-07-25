import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SecondaryOverlayPanel from '../../components/SecondaryOverlayPanel/SecondaryOverlayPanel'

import actions from '../../actions'

const mapStateToProps = state => ({
  isOpen: state.ui.secondaryOverlayPanel.isOpen
})

const mapDispatchToProps = dispatch => ({
  onToggleSecondaryOverlayPanel: state => dispatch(actions.toggleSecondaryOverlayPanel(state))
})

export const SecondaryOverlayPanelContainer = ({
  body,
  footer,
  header,
  isOpen,
  onToggleSecondaryOverlayPanel
}) => (
  <SecondaryOverlayPanel
    body={body}
    header={header}
    footer={footer}
    isOpen={isOpen}
    onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
  />
)

SecondaryOverlayPanelContainer.defaultProps = {
  footer: null
}

SecondaryOverlayPanelContainer.propTypes = {
  body: PropTypes.node.isRequired,
  footer: PropTypes.node,
  header: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryOverlayPanelContainer)
