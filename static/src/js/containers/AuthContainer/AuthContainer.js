import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'
import { connect } from 'react-redux'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onUpdateAuth:
    token => dispatch(actions.updateAuth(token))
})

export class AuthContainer extends Component {
  componentWillMount() {
    const { onUpdateAuth } = this.props

    const jwtToken = get('auth')
    onUpdateAuth(jwtToken || '')
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

AuthContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onUpdateAuth: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AuthContainer)
