// @ts-expect-error This file does not have types
import LoggerRequest from '../../request/loggerRequest'
// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../../sharedUtils/config'

import useEdscStore from '../../../zustand/useEdscStore'
import { getNlpSearchMode } from '../../../zustand/selectors/growthbook'
import { localStorageKeys } from '../../../constants/localStorageKeys'
import { sessionStorageKeys } from '../../../constants/sessionStorageKeys'

interface LogEventParams {
  /** The data associated with the event */
  eventData?: string
  /** The type of the event */
  eventType: string
  /** The ID of the experiment */
  experimentId?: string
  /** The ID of the variation */
  variationId?: string
}

const logEvent = async ({
  eventData,
  eventType,
  experimentId,
  variationId
}: LogEventParams) => {
  try {
    const { growthbookEnabled } = getApplicationConfig()
    if (growthbookEnabled !== 'true') {
      console.log('GrowthBook is not enabled. Event will not be logged.')

      return
    }

    const state = useEdscStore.getState()
    const nlpSearchMode = getNlpSearchMode(state)

    const gbUserId = window.localStorage.getItem(localStorageKeys.gbUserId) || 'unknown-user-id'
    const gbSessionId = window.sessionStorage.getItem(sessionStorageKeys.gbSessionId) || 'unknown-session-id'

    const loggerRequest = new LoggerRequest()

    const params = {
      eventData: {
        event_data: eventData,
        event_type: eventType,
        experiment_id: experimentId,
        nlp_value: nlpSearchMode === 'nlp' ? 'true' : 'false',
        session_id: gbSessionId,
        user_id: gbUserId,
        variation_id: variationId
      }
    }

    await loggerRequest.logExperiment(params)
  } catch (error) {
    console.error('Error logging event:', error)
  }
}

export default logEvent
