import React from 'react'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'

// @ts-expect-error: Types do not exist for this file
import { getApplicationConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'
import GrowthBookLoader from '../GrowthBookLoader/GrowthBookLoader'

interface GrowthBookWrapperProps {
  children: React.ReactNode
}

const GrowthBookWrapper = ({ children }: GrowthBookWrapperProps) => {
  const { growthbookEnabled } = getApplicationConfig()

  // If GrowthBook is not enabled, return the children
  if (growthbookEnabled !== 'true') {
    return children
  }

  // If GrowthBook is enabled, initialize the GrowthBook client and wrap the children in the GrowthBookProvider

  const {
    growthbookApiHost = 'http://localhost:4100',
    growthbookClientKey
  } = getEnvironmentConfig()

  const { NODE_ENV } = process.env

  const growthbook = new GrowthBook({
    apiHost: growthbookApiHost,
    clientKey: growthbookClientKey,
    enableDevMode: NODE_ENV === 'development',
    // Only required for A/B testing
    // Called every time a user is put into an experiment
    trackingCallback: (experiment, result) => {
      // TODO call logEvent?
      console.log('Experiment Viewed', {
        experimentId: experiment.key,
        variationId: result.key
      })
    }
  })
  growthbook.init({})

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <GrowthBookLoader>
        {children}
      </GrowthBookLoader>
    </GrowthBookProvider>
  )
}

export default GrowthBookWrapper
