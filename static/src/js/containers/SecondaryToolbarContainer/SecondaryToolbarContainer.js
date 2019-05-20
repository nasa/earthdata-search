import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

const mapStateToProps = state => ({
  auth: state.auth
})

export const SecondaryToolbarContainer = (props) => {
  const { auth } = props

  return (
    <SecondaryToolbar auth={auth} />
  )
}

SecondaryToolbarContainer.propTypes = {
  auth: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(SecondaryToolbarContainer)
