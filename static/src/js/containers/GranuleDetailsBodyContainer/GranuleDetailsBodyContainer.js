import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleDetailsBody from '../../components/GranuleDetails/GranuleDetailsBody'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
  granuleMetadata: getFocusedGranuleMetadata(state)
})

export const GranuleDetailsBodyContainer = ({
  authToken,
  earthdataEnvironment,
  granuleMetadata
}) => (
  <GranuleDetailsBody
    authToken={authToken}
    earthdataEnvironment={earthdataEnvironment}
    granuleMetadata={granuleMetadata}
  />
)

GranuleDetailsBodyContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsBodyContainer)
)
