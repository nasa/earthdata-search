import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import './ErrorBanner.scss'

export const ErrorBanner = ({ error, onRemoveError }) => {
  const onCloseBanner = () => {
    const { id } = error
    console.log('close banner', id)
    onRemoveError(id)
  }
  const { message, title } = error

  return (
    <div className="banner banner-error">
      <Button
        className="banner-close"
        label="close"
        onClick={onCloseBanner}
      >
        <i className="fa fa-times-circle" />
      </Button>
      <h1 className="banner-title">{title}</h1>
      {' '}
      <p className="banner-text">{message}</p>
    </div>
  )
}

ErrorBanner.propTypes = {
  error: PropTypes.shape({}).isRequired,
  onRemoveError: PropTypes.func.isRequired
}

export default ErrorBanner
