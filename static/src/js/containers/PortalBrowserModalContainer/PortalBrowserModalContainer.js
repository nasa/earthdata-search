import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions'

import { PortalBrowserModal } from '../../components/PortalBrowserModal/PortalBrowserModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.portalBrowserModal.isOpen,
  portals: state.availablePortals
})

export const mapDispatchToProps = (dispatch) => ({
  onTogglePortalBrowserModal:
    (state) => dispatch(actions.togglePortalBrowserModal(state))
})

/**
 * Renders PortalBrowserModalContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Boolean} props.isOpen - The modal state.
 * @param {Function} props.onTogglePortalBrowserModal - Callback function close the modal.
 */
export const PortalBrowserModalContainer = ({
  isOpen,
  portals,
  onTogglePortalBrowserModal
}) => (
  <PortalBrowserModal
    isOpen={isOpen}
    portals={portals}
    onTogglePortalBrowserModal={onTogglePortalBrowserModal}
  />
)

PortalBrowserModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  portals: PropTypes.shape({}).isRequired,
  onTogglePortalBrowserModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PortalBrowserModalContainer)
