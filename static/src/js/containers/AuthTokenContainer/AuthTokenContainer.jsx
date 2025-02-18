import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'
import { connect } from 'react-redux'

import actions from '../../actions/index'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

export const mapDispatchToProps = (dispatch) => ({
  onSetContactInfoFromJwt:
    (token) => dispatch(actions.setContactInfoFromJwt(token)),
  onSetPreferencesFromJwt:
    (token) => dispatch(actions.setPreferencesFromJwt(token)),
  onSetUserFromJwt:
    (token) => dispatch(actions.setUserFromJwt(token)),
  onUpdateAuthToken:
    (token) => dispatch(actions.updateAuthToken(token))
})

export const AuthTokenContainer = ({
  children,
  onSetContactInfoFromJwt,
  onSetPreferencesFromJwt,
  onSetUserFromJwt,
  onUpdateAuthToken
}) => {
  const { disableDatabaseComponents } = getApplicationConfig()

  useEffect(() => {
    if (disableDatabaseComponents === 'true') {
      // If we have set `disableDatabaseComponents` to true, we need to clear the authToken
      // This will ensure that the user does not send requests to our API (which uses the database)
      onUpdateAuthToken('')

      return
    }

    const jwtToken = get('authToken')

    onSetPreferencesFromJwt(jwtToken)
    onSetContactInfoFromJwt(jwtToken)
    onSetUserFromJwt(jwtToken)
    onUpdateAuthToken(jwtToken || '')
  }, [])

  return children
}

AuthTokenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onSetContactInfoFromJwt: PropTypes.func.isRequired,
  onSetPreferencesFromJwt: PropTypes.func.isRequired,
  onSetUserFromJwt: PropTypes.func.isRequired,
  onUpdateAuthToken: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AuthTokenContainer)
