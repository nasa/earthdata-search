import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import CollectionDetailsTab from '../../components/CollectionDetails/CollectionDetailsTab'

export const CollectionDetailsTabContainer = ({ location, match }) => (
  <CollectionDetailsTab
    location={location}
    match={match}
  />
)

CollectionDetailsTabContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default withRouter(
  CollectionDetailsTabContainer
)
