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

/**
 * Renders SecondaryOverlayPanelContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.body - The panel body.
 * @param {Node} props.header - The panel header.
 * @param {Node} props.footer - The panel footer.
 * @param {Boolean} props.isOpen - Determines if the panel should be open.
 * @param {Function} props.onToggleSecondaryOverlayPanel - Callback function to toggle the panel.
 */
export const SecondaryOverlayPanelContainer = ({
  body,
  footer,
  header,
  isOpen,
  onToggleSecondaryOverlayPanel
}) => (
  <>
    {
      isOpen && (
        <SecondaryOverlayPanel
          body={body}
          header={header}
          footer={footer}
          isOpen={isOpen}
          onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
        />
      )
     }
  </>
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
