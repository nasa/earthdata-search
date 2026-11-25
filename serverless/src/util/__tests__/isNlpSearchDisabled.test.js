import { mockClient } from 'aws-sdk-client-mock'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

import { clearNlpSearchDisabledCache, isNlpSearchDisabled } from '../isNlpSearchDisabled'

const ssmClientMock = mockClient(SSMClient)

const OLD_ENV = process.env

beforeEach(() => {
  ssmClientMock.reset()
  clearNlpSearchDisabledCache()

  process.env = { ...OLD_ENV }
  process.env.NLP_SEARCH_DISABLED_PARAMETER_NAME = '/earthdata-search/test/nlp-search-disabled'
})

afterEach(() => {
  process.env = OLD_ENV
  vi.useRealTimers()
})

describe('isNlpSearchDisabled', () => {
  describe('when the parameter name is not configured', () => {
    test('returns false without calling SSM', async () => {
      delete process.env.NLP_SEARCH_DISABLED_PARAMETER_NAME

      expect(await isNlpSearchDisabled()).toEqual(false)
      expect(ssmClientMock.commandCalls(GetParameterCommand)).toHaveLength(0)
    })
  })

  describe('when the parameter is "true"', () => {
    test('returns true', async () => {
      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'true' } })

      expect(await isNlpSearchDisabled()).toEqual(true)

      const getCalls = ssmClientMock.commandCalls(GetParameterCommand)
      expect(getCalls).toHaveLength(1)
      expect(getCalls[0].args[0].input).toEqual({
        Name: '/earthdata-search/test/nlp-search-disabled'
      })
    })
  })

  describe('when the parameter is "false"', () => {
    test('returns false', async () => {
      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'false' } })

      expect(await isNlpSearchDisabled()).toEqual(false)
    })
  })

  describe('when the value has been cached', () => {
    test('does not call SSM again until the cache expires', async () => {
      vi.useFakeTimers()

      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'true' } })

      expect(await isNlpSearchDisabled()).toEqual(true)
      expect(await isNlpSearchDisabled()).toEqual(true)
      expect(ssmClientMock.commandCalls(GetParameterCommand)).toHaveLength(1)

      vi.advanceTimersByTime(61 * 1000)

      expect(await isNlpSearchDisabled()).toEqual(true)
      expect(ssmClientMock.commandCalls(GetParameterCommand)).toHaveLength(2)
    })
  })

  describe('when SSM returns an error', () => {
    test('logs the error and returns false', async () => {
      const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {})

      ssmClientMock.on(GetParameterCommand).rejects(new Error('AccessDenied'))

      expect(await isNlpSearchDisabled()).toEqual(false)
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith(
        'Error reading SSM parameter /earthdata-search/test/nlp-search-disabled:',
        new Error('AccessDenied')
      )
    })
  })
})
