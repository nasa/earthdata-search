import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get, remove } from 'tiny-cookie'

import { getEnvironmentConfig, getApplicationConfig } from '../../../../../sharedUtils/config'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import RedirectingAuthState from '../../components/RedirectingAuthState/RedirectingAuthState'

import './AuthRequiredContainer.scss'

export const AuthRequiredContainer = ({
  noRedirect = false,
  children
}) => {
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const { apiHost } = getEnvironmentConfig()
    const { disableDatabaseComponents } = getApplicationConfig()

    const token = get('edlToken')
    if (disableDatabaseComponents === 'true') {
      remove('edlToken')
    }

    const returnPath = window.location.href

    if (token === null || token === '') {
      setIsLoggedIn(false)

      if (!noRedirect) {
        setIsRedirecting(true)

        let location = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`
        if (disableDatabaseComponents === 'true') {
          location = '/search'
        }

        window.location.href = location
      } else {
        setIsRedirecting(false)
      }
    } else {
      setIsLoggedIn(true)
      setIsRedirecting(false)
    }
  }, [])

  if (isLoggedIn) {
    return children
  }

  if (isRedirecting) {
    return (
      <div className="auth-required">
        <RedirectingAuthState />
      </div>
    )
  }

  return (
    <div className="auth-required" />
  )
}

AuthRequiredContainer.propTypes = {
  noRedirect: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default AuthRequiredContainer
