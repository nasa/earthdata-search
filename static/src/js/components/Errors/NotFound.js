import React from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'

import LoggerRequest from '../../util/request/loggerRequest'

const NotFound = ({ location }) => {
  // eslint-disable-next-line global-require
  require('./ErrorBoundary.scss')

  const guid = uuidv4()

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
      <h1>Sorry! The page you were looking for does not exist.</h1>
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
  location: PropTypes.shape({}).isRequired
}

export default NotFound
