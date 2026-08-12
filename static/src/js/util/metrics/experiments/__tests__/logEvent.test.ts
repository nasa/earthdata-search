import useEdscStore from '../../../../zustand/useEdscStore'
import logEvent from '../logEvent'

// @ts-expect-error This file does not have types
import LoggerRequest from '../../../request/loggerRequest'

describe('logEvent', () => {
  test('calls LoggerRequest.logExperiment with the correct parameters when nlpSearch is enabled', async () => {
    const loggerRequestMock = vi.spyOn(LoggerRequest.prototype, 'logExperiment').mockResolvedValue({
      status: 200,
      statusText: 'OK'
    })

    const { growthbook } = useEdscStore.getState()
    growthbook.setFeatureFlags('nlpSearch', true)

    const eventType = 'test_event'
    const eventData = 'test_data'

    await logEvent(eventType, eventData)

    expect(loggerRequestMock).toHaveBeenCalledTimes(1)
    expect(loggerRequestMock).toHaveBeenCalledWith({
      eventData: {
        experiment_id: 'nlpSearch',
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

      const { growthbook } = useEdscStore.getState()
      growthbook.setFeatureFlags('nlpSearch', false)

      const eventType = 'test_event'
      const eventData = 'test_data'

      await logEvent(eventType, eventData)

      expect(loggerRequestMock).not.toHaveBeenCalled()
      expect(consoleLogMock).toHaveBeenCalledWith('Experiment nlpSearch is not enabled. Event will not be logged.')
    })
  })
})
