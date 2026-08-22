// @ts-expect-error This file does not have types
import LoggerRequest from '../../request/loggerRequest'
// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../../sharedUtils/config'

import useEdscStore from '../../../zustand/useEdscStore'

const logEvent = async (eventKey: string, eventType: string, eventData: string) => {
  try {
    const { growthbookEnabled } = getApplicationConfig()
    if (growthbookEnabled !== 'true') {
      console.log('GrowthBook is not enabled. Event will not be logged.')

      return
    }

    const { growthbook } = useEdscStore.getState()
    const { featureFlags } = growthbook
    const { [eventKey]: eventValue } = featureFlags

    const gbUserId = window.localStorage.getItem('gbUserId') || 'unknown-user-id'
    const gbSessionId = window.sessionStorage.getItem('gbSessionId') || 'unknown-session-id'

    const loggerRequest = new LoggerRequest()

    const params = {
      eventData: {
        experiment_id: eventKey,
        variation_id: eventValue,
        event_type: eventType,
        event_data: eventData,
        session_id: gbSessionId,
        user_id: gbUserId
      }
    }

    await loggerRequest.logExperiment(params)
  } catch (error) {
    console.error('Error logging event:', error)
  }
}

export default logEvent
