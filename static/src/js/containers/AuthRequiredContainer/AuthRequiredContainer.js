import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

const mapStateToProps = state => ({
  earthdataEnvironment: getEarthdataEnvironment(state)
})

export class AuthRequiredContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false
    }
  }

  componentWillMount() {
    const { redirect } = this.props
    const { apiHost } = getEnvironmentConfig()

    const token = get('authToken')

    const { earthdataEnvironment } = this.props

    const returnPath = window.location.href

    if (token === null || token === '') {
      this.setState({ isLoggedIn: false })
    } else {
      this.setState({ isLoggedIn: true })
    }

    if ((token === null || token === '') && redirect) window.location.href = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`
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
  redirect: true
}

AuthRequiredContainer.propTypes = {
  redirect: PropTypes.bool,
  children: PropTypes.node.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(AuthRequiredContainer)
