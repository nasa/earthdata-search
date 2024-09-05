import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

import { eventEmitter } from '../../events/events'

import LoggerRequest from '../../util/request/loggerRequest'

import './ErrorBoundary.scss'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errorGuid: null,
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    const guid = uuidv4()
    const { message, stack } = error
    const { location } = window

    const requestObject = new LoggerRequest()
    requestObject.log({
      error: {
        guid,
        location,
        message,
        stack
      }
    })

    return {
      errorGuid: guid,
      hasError: true
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { hasError: prevHasError } = prevState
    const { hasError } = this.state

    if (prevHasError !== hasError) {
      eventEmitter.emit('error.global', hasError)
    }
  }

  render() {
    const { errorGuid, hasError } = this.state
    const { children } = this.props

    if (hasError) {
      // If error present, modify the background color of root element for the not found page so we can load stars jpg
      const element = document.getElementById('app')
      if (element) {
        element.style.backgroundColor = 'initial'
      }

      return (
        <div className="wrap">
          <h2 className="h1">
            We&#39;re sorry, but something went wrong.
          </h2>
          <p>
            An unknown error occurred. Please refer to the ID
            {' '}
            <strong>
              {errorGuid}
            </strong>
            {' '}
            when contacting
            {' '}
            <a href="mailto:support@earthdata.nasa.gov" className="error-boundary__link">Earthdata Operations</a>
            .
          </p>
          <p>
            <a href="/" className="error-boundary__link">Click here</a>
            {' '}
            to return to the home page.
          </p>
          <div className="earth">
            <div className="orbit" />
          </div>
        </div>
      )
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary
