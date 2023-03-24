import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import actions from '../../actions'

import { PortalBrowserModal } from '../../components/PortalBrowserModal/PortalBrowserModal'

import { locationPropType } from '../../util/propTypes/location'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.portalBrowserModal.isOpen
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
  location,
  onTogglePortalBrowserModal
}) => (
  <PortalBrowserModal
    isOpen={isOpen}
    location={location}
    onTogglePortalBrowserModal={onTogglePortalBrowserModal}
  />
)

PortalBrowserModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  onTogglePortalBrowserModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalBrowserModalContainer)
)
