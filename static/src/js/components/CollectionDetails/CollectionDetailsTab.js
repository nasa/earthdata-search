import React from 'react'
import PropTypes from 'prop-types'

import './CollectionDetailsTab.scss'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

/**
 * Renders CollectionDetailsTab.
 * @param {object} props - The props passed into the component.
 * @param {object} location - The location passed into the component from React Router.
 */

export const CollectionDetailsTab = ({ location }) => (
  <span className="collection-details-tab">
    <PortalLinkContainer
      className="collection-details-tab__button"
      type="button"
      label="Back to Granules"
      to={{
        pathname: '/search/granules',
        search: location.search
      }}
    >
      <i className="fa fa-chevron-circle-left" />
      {' Back to Granules'}
    </PortalLinkContainer>
  </span>
)

CollectionDetailsTab.propTypes = {
  location: PropTypes.shape({}).isRequired
}

export default CollectionDetailsTab
