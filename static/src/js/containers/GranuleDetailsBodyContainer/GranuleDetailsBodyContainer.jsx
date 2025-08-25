import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GranuleDetailsBody from '../../components/GranuleDetails/GranuleDetailsBody'

export const mapStateToProps = (state) => ({
  authToken: state.authToken
})

export const GranuleDetailsBodyContainer = ({
  authToken
}) => (
  <GranuleDetailsBody
    authToken={authToken}
  />
)

GranuleDetailsBodyContainer.propTypes = {
  authToken: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(GranuleDetailsBodyContainer)
