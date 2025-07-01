import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'
import { connect } from 'react-redux'

import actions from '../../actions/index'
import useEdscStore from '../../zustand/useEdscStore'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

export const mapDispatchToProps = (dispatch) => ({
  onSetContactInfoFromJwt:
    (token) => dispatch(actions.setContactInfoFromJwt(token)),
  onSetUserFromJwt:
    (token) => dispatch(actions.setUserFromJwt(token)),
  onUpdateAuthToken:
    (token) => dispatch(actions.updateAuthToken(token))
})

export const AuthTokenContainer = ({
  children,
  onSetContactInfoFromJwt,
  onSetUserFromJwt,
  onUpdateAuthToken
}) => {
  const { disableDatabaseComponents } = getApplicationConfig()
  // Get Zustand preferences action
  const setPreferencesFromJwt = useEdscStore((state) => state.preferences.setPreferencesFromJwt)

  useEffect(() => {
    if (disableDatabaseComponents === 'true') {
      // If we have set `disableDatabaseComponents` to true, we need to clear the authToken
      // This will ensure that the user does not send requests to our API (which uses the database)
      onUpdateAuthToken('')

      return
    }

    const jwtToken = get('authToken')

    // Use Zustand for preferences
    setPreferencesFromJwt(jwtToken)
    // Keep Redux for other JWT operations
    onSetContactInfoFromJwt(jwtToken)
    onSetUserFromJwt(jwtToken)
    onUpdateAuthToken(jwtToken || '')
  }, [setPreferencesFromJwt, onSetContactInfoFromJwt, onSetUserFromJwt, onUpdateAuthToken])

  return children
}

AuthTokenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onSetContactInfoFromJwt: PropTypes.func.isRequired,
  onSetUserFromJwt: PropTypes.func.isRequired,
  onUpdateAuthToken: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AuthTokenContainer)
