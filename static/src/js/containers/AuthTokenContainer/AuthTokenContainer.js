import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'
import { connect } from 'react-redux'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onSetContactInfoFromJwt:
    token => dispatch(actions.setContactInfoFromJwt(token)),
  onSetPreferencesFromJwt:
    token => dispatch(actions.setPreferencesFromJwt(token)),
  onUpdateAuthToken:
    token => dispatch(actions.updateAuthToken(token))
})

export class AuthTokenContainer extends Component {
  componentWillMount() {
    const {
      onSetContactInfoFromJwt,
      onSetPreferencesFromJwt,
      onUpdateAuthToken
    } = this.props

    const jwtToken = get('authToken')

    onUpdateAuthToken(jwtToken || '')
    onSetPreferencesFromJwt(jwtToken)
    onSetContactInfoFromJwt(jwtToken)
  }

  render() {
    const { children } = this.props

    return (
      <>
        { children }
      </>
    )
  }
}

AuthTokenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onSetContactInfoFromJwt: PropTypes.func.isRequired,
  onSetPreferencesFromJwt: PropTypes.func.isRequired,
  onUpdateAuthToken: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AuthTokenContainer)
