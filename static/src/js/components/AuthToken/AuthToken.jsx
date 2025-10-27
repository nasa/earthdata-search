import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import useEdscStore from '../../zustand/useEdscStore'

const AuthToken = ({
  children
}) => {
  const setAuthToken = useEdscStore((state) => state.user.setAuthToken)

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
      setAuthToken(undefined)

      return
    }

    const jwtToken = get('authToken')

    setAuthToken(jwtToken)
  }, [])

  if (!firstLoadFinished) return null

  return children
}

AuthToken.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthToken
