import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get, remove } from 'tiny-cookie'

import { getEnvironmentConfig, getApplicationConfig } from '../../../../../sharedUtils/config'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import RedirectingAuthState from '../../components/RedirectingAuthState/RedirectingAuthState'

export const AuthRequiredContainer = ({
  noRedirect = false,
  children
}) => {
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const [authStatus, setAuthStatus] = useState('checking') // "checking" | "authenticated" | "unauthenticated"

  useEffect(() => {
    const { apiHost } = getEnvironmentConfig()
    const { disableDatabaseComponents } = getApplicationConfig()

    const token = get('edlToken')
    if (disableDatabaseComponents === 'true') {
      remove('edlToken')
    }

    const returnPath = window.location.href

    if (token === null || token === '') {
      setAuthStatus('unauthenticated')

      if (!noRedirect) {
        setAuthStatus('redirecting')

        let location = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`
        if (disableDatabaseComponents === 'true') {
          location = '/search'
        }

        window.location.href = location
      }
    } else {
      setAuthStatus('authenticated')
    }
  }, [])

  if (authStatus === 'authenticated') {
    return children
  }

  if (authStatus === 'checking' || authStatus === 'redirecting') {
    return (
      <div data-testid="auth-required">
        <RedirectingAuthState />
      </div>
    )
  }

  return (
    <div data-testid="auth-required" className="route-wrapper" />
  )
}

AuthRequiredContainer.propTypes = {
  noRedirect: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default AuthRequiredContainer
