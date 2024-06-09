import React, { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { eventEmitter } from '../../events/events'
import LoggerRequest from '../../util/request/loggerRequest'
import { locationPropType } from '../../util/propTypes/location'

export const NotFound = ({
  location
}) => {
  useEffect(() => {
    eventEmitter.emit('error.global', true)

    return () => {
      eventEmitter.emit('error.global', false)
    }
  }, [])

  const guid = uuidv4()

  // Modify the background color of root element for the not found page so we can load stars jpg
  const selectElementById = () => {
    const element = document.getElementById('app')
    if (element) {
      element.style.backgroundColor = 'initial'
      console.log(element.textContent)
    }
  }

  selectElementById()

  const requestObject = new LoggerRequest()
  requestObject.log({
    error: {
      guid,
      message: '404 Not Found',
      location
    }
  })

  return (
    <div className="wrap">
      <h2 className="h1">Sorry! The page you were looking for does not exist.</h2>
      <p>
        Please refer to the ID
        {' '}
        <strong>
          {guid}
        </strong>
        {' '}
        when contacting
        {' '}
        <a href="mailto:support@earthdata.nasa.gov">Earthdata Operations</a>
        .
      </p>
      <p>
        <a href="/">Click here</a>
        {' '}
        to return to the home page.
      </p>
      <div className="earth">
        <div className="orbit" />
      </div>
    </div>
  )
}

NotFound.propTypes = {
  location: locationPropType.isRequired
}

export default NotFound
