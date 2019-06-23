import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

const mapStateToProps = state => ({
  authToken: state.authToken,
  projectIds: state.project.collectionIds
})

export const SecondaryToolbarContainer = (props) => {
  const {
    authToken,
    projectIds,
    location
  } = props

  return (
    <SecondaryToolbar
      authToken={authToken}
      projectIds={projectIds}
      location={location}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  projectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(SecondaryToolbarContainer)
)
