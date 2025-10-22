import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'
import { connect } from 'react-redux'

import actions from '../../actions/index'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

export const mapDispatchToProps = (dispatch) => ({
  onUpdateAuthToken:
    (token) => dispatch(actions.updateAuthToken(token))
})

export const AuthTokenContainer = ({
  children,
  onUpdateAuthToken
}) => {
  // `firstLoadFinished` ensures that we don't render the children until we've checked for a token
  // This prevents child components from rendering and making requests with an empty token but
  // an `authToken` cookie does exist
  const [firstLoadFinished, setFirstLoadFinished] = useState(false)

  const { disableDatabaseComponents } = getApplicationConfig()

  useEffect(() => {
    setFirstLoadFinished(true)

    if (disableDatabaseComponents === 'true') {
      // If we have set `disableDatabaseComponents` to true, we need to clear the authToken
      // This will ensure that the user does not send requests to our API (which uses the database)
      onUpdateAuthToken('')

      return
    }

    const jwtToken = get('authToken')

    onUpdateAuthToken(jwtToken || '')
  }, [])

  if (!firstLoadFinished) return null

  return children
}

AuthTokenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onUpdateAuthToken: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AuthTokenContainer)
