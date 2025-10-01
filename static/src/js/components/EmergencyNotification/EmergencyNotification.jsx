import React, { useState } from 'react'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Banner from '../Banner/Banner'

/**
 * Display an emergency notification banner if configured.
 */
const EmergencyNotification = () => {
  const {
    emergencyNotification,
    emergencyNotificationType = 'error'
  } = getApplicationConfig()

  // The banner will be able to be dismissed, but will always show on page load.
  const [dismissed, setDismissed] = useState(false)

  // If there is no emergency notification or it has been dismissed, don't render anything.
  if (!emergencyNotification || dismissed) {
    return null
  }

  return (
    <Banner
      title={emergencyNotification}
      type={emergencyNotificationType}
      onClose={() => setDismissed(true)}
    />
  )
}

export default EmergencyNotification
