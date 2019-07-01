import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import CollectionDetailsTab from '../../components/CollectionDetails/CollectionDetailsTab'

export const CollectionDetailsTabContainer = ({ location }) => (
  <CollectionDetailsTab
    location={location}
  />
)

CollectionDetailsTabContainer.propTypes = {
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  CollectionDetailsTabContainer
)
