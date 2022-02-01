import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const mapStateToProps = (state) => ({
  earthdataEnvironment: getEarthdataEnvironment(state)
})

export class AuthRequiredContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false
    }
  }

  UNSAFE_componentWillMount() {
    const { noRedirect } = this.props
    const { apiHost } = getEnvironmentConfig()

    const token = get('authToken')

    const { earthdataEnvironment } = this.props

    const returnPath = window.location.href

    if (token === null || token === '') {
      this.setState({ isLoggedIn: false })

      if (!noRedirect) window.location.href = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`
    } else {
      this.setState({ isLoggedIn: true })
    }
  }

  render() {
    const { isLoggedIn } = this.state

    if (isLoggedIn) {
      const {
        children
      } = this.props

      return (
        <>
          { children }
        </>
      )
    }

    return (
      <div className="route-wrapper" />
    )
  }
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
