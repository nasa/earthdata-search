import React, { useEffect, useState } from 'react'
import { useRouteError } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { eventEmitter } from '../../events/events'

import LoggerRequest from '../../util/request/loggerRequest'

import './ErrorBoundary.scss'

const RouterErrorBoundary = () => {
  const error = useRouteError()
  const [errorId, setErrorId] = useState(null)

  useEffect(() => {
    if (error) {
      const newErrorId = uuidv4()
      setErrorId(newErrorId)
      const { location } = window

      eventEmitter.emit('error.global', true)

      const requestObject = new LoggerRequest()
      requestObject.log({
        error: {
          guid: newErrorId,
          location,
          message: error.message,
          stack: error.stack
        }
      })
    }
  }, [error])

  if (errorId) {
    return (
      <div className="wrap">
        <h2 className="h1 error-boundary__heading">
          We&#39;re sorry, but something went wrong.
        </h2>
        <p>
          An unknown error occurred. Please refer to the ID
          {' '}
          <strong>
            {errorId}
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

  return null
}

export default RouterErrorBoundary
