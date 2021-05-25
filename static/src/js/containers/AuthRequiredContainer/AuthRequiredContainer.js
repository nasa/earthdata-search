import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const mapStateToProps = state => ({
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
    this.setState({ isLoggedIn: true })
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

AuthRequiredContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default connect(mapStateToProps, null)(AuthRequiredContainer)
