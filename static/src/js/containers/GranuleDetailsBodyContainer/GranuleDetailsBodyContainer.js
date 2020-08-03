import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleDetailsBody from '../../components/GranuleDetails/GranuleDetailsBody'

const mapStateToProps = state => ({
  authToken: state.authToken,
  granuleMetadata: getFocusedGranuleMetadata(state)
})

export const GranuleDetailsBodyContainer = ({
  authToken,
  granuleMetadata
}) => (
  <GranuleDetailsBody
    authToken={authToken}
    granuleMetadata={granuleMetadata}
  />
)

GranuleDetailsBodyContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsBodyContainer)
)
