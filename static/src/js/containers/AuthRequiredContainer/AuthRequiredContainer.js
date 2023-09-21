import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const mapStateToProps = (state) => ({
  earthdataEnvironment: getEarthdataEnvironment(state)
})

export const AuthRequiredContainer = ({
  noRedirect,
  children,
  earthdataEnvironment
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const { apiHost } = getEnvironmentConfig()

    const token = get('authToken')

    const returnPath = window.location.href

    if (token === null || token === '') {
      setIsLoggedIn(false)
      if (!noRedirect) window.location.href = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`
    } else {
      setIsLoggedIn(true)
    }
  }, [])

  if (isLoggedIn) {
    return children
  }

  return (
    <div data-testid="auth-required" className="route-wrapper" />
  )
}

AuthRequiredContainer.defaultProps = {
  noRedirect: false
}

AuthRequiredContainer.propTypes = {
  noRedirect: PropTypes.bool,
  children: PropTypes.node.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(AuthRequiredContainer)
