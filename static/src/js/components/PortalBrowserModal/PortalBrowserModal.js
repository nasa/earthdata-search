import React from 'react'
import PropTypes from 'prop-types'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import { PortalList } from './PortalList'

/**
 * Renders PortalBrowserModal.
 * @param {Object} props - The props passed into the component.
 * @param {Boolean} props.isOpen - The modal state.
 * @param {Object} props.portals - Available portals to be displayed.
 * @param {Function} props.onTogglePortalBrowserModal - Callback function close the modal.
 */
export const PortalBrowserModal = ({
  isOpen,
  portals,
  onTogglePortalBrowserModal
}) => {
  const onModalClose = () => {
    onTogglePortalBrowserModal(false)
  }

  const body = (
    <div>
      <p>
        Enable a portal to quickly refine the data available within Earthdata Search
        by limiting the search results to a particular area of interest, project, or organization.
      </p>
      <p>
        Note: Enabling a portal might impact the features available for search.
      </p>
      <PortalList portals={portals} />
    </div>
  )

  return (
    <EDSCModalContainer
      className="portal-browser-modal"
      title="Browse Portals"
      isOpen={isOpen}
      id="portal-browser"
      size="lg"
      fixedHeight="sm"
      onClose={onModalClose}
      body={body}
      dataTestId="portal-browser-modal"
    />
  )
}

PortalBrowserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  portals: PropTypes.shape({}).isRequired,
  onTogglePortalBrowserModal: PropTypes.func.isRequired
}
