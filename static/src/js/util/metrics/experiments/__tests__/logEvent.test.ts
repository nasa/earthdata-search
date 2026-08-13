import useEdscStore from '../../../../zustand/useEdscStore'
import logEvent from '../logEvent'

// @ts-expect-error This file does not have types

import * as config from '../../../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import LoggerRequest from '../../../request/loggerRequest'

describe('logEvent', () => {
  test('calls LoggerRequest.logExperiment with the correct parameters when nlpSearch is enabled', async () => {
    const loggerRequestMock = vi.spyOn(LoggerRequest.prototype, 'logExperiment').mockResolvedValue({
      status: 200,
      statusText: 'OK'
    })

    vi.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      growthbookEnabled: 'true'
    }))

    const { growthbook } = useEdscStore.getState()
    growthbook.setFeatureFlags('test_experiment', true)

    const eventKey = 'test_experiment'
    const eventType = 'test_event'
    const eventData = 'test_data'

    await logEvent(eventKey, eventType, eventData)

    expect(loggerRequestMock).toHaveBeenCalledTimes(1)
    expect(loggerRequestMock).toHaveBeenCalledWith({
      eventData: {
        experiment_id: 'test_experiment',
        variation_id: true,
        event_type: eventType,
        event_data: eventData,
        session_id: expect.any(String),
        user_id: expect.any(String)
      }
    })
  })

  describe('when the feature flag is not enabled', () => {
    test('does not call LoggerRequest.logExperiment and logs a message to the console', async () => {
      const loggerRequestMock = vi.spyOn(LoggerRequest.prototype, 'logExperiment')
      const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      vi.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        growthbookEnabled: 'false'
      }))

      const eventKey = 'test_experiment'
      const eventType = 'test_event'
      const eventData = 'test_data'

      await logEvent(eventKey, eventType, eventData)

      expect(loggerRequestMock).not.toHaveBeenCalled()
      expect(consoleLogMock).toHaveBeenCalledWith('GrowthBook is not enabled. Event will not be logged.')
    })
  })
})
