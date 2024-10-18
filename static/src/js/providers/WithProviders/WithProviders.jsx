import React from 'react'
import Providers from '../Providers/Providers'

const withProviders = (WrappedComponent) => {
  const WithProviders = (props) => (
    <Providers>
      <WrappedComponent {...props} />
    </Providers>
  )

  return WithProviders
}

export default withProviders
