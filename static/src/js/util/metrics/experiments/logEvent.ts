// @ts-expect-error This file does not have types
import LoggerRequest from '../../request/loggerRequest'

import useEdscStore from '../../../zustand/useEdscStore'

const logEvent = async (eventType: string, eventData: string) => {
  try {
    const { growthbook } = useEdscStore.getState()
    const { featureFlags } = growthbook
    const { nlpSearch: nlpSearchValue } = featureFlags

    if (!nlpSearchValue) {
      console.log('Experiment nlpSearch is not enabled. Event will not be logged.')

      return
    }

    const gbUserId = window.localStorage.getItem('gbUserId') || 'unknown-user-id'
    const gbSessionId = window.sessionStorage.getItem('gbSessionId') || 'unknown-session-id'

    const loggerRequest = new LoggerRequest()

    const params = {
      eventData: {
        experiment_id: 'nlpSearch',
        variation_id: nlpSearchValue,
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
