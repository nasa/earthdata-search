import React from 'react'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import { Banner } from '../Banner/Banner'
import useEdscStore from '../../zustand/useEdscStore'

const ErrorBanner = () => {
  const errors = useEdscStore((state) => state.errors.errorsList)
  const removeError = useEdscStore((state) => state.errors.removeError)

  if (!errors || errors.length === 0) return null

  const [error] = errors

  const {
    id,
    message,
    title,
    showAlertButton
  } = error

  const { disableDatabaseComponents } = getApplicationConfig()

  const regex = /connect ECONNREFUSED/
  const dbConnectionError = regex.test(error.message)

  if ((disableDatabaseComponents === 'true') && dbConnectionError) {
    console.log('Error caught for database being down ', error.message)

    return null
  }

  const onClose = () => {
    removeError(id)
  }

  return (
    <Banner
      message={message}
      onClose={onClose}
      title={title}
      type="error"
      showAlertButton={showAlertButton}
    />
  )
}

export default ErrorBanner
