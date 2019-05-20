import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

const mapStateToProps = state => ({
  authToken: state.authToken
})

export const SecondaryToolbarContainer = (props) => {
  const { authToken } = props

  return (
    <SecondaryToolbar authToken={authToken} />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(SecondaryToolbarContainer)
