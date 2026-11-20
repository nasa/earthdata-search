import { mockClient } from 'aws-sdk-client-mock'
import {
  GetParameterCommand,
  PutParameterCommand,
  SSMClient
} from '@aws-sdk/client-ssm'

import setNlpSearchStatus from '../handler'

const ssmClientMock = mockClient(SSMClient)

const OLD_ENV = process.env

const snsEvent = {
  Records: [{
    EventSource: 'aws:sns',
    Sns: {
      Subject: 'AWS Budgets: earthdata-search-test-bedrock has exceeded your alert threshold',
      Message: 'Budget notification message'
    }
  }]
}

beforeEach(() => {
  ssmClientMock.reset()

  process.env = { ...OLD_ENV }
  process.env.NLP_SEARCH_DISABLED_PARAMETER_NAME = '/earthdata-search/test/nlp-search-disabled'
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('setNlpSearchStatus', () => {
  describe('when triggered by the budget SNS topic', () => {
    test('sets the NLP search disabled SSM parameter to true', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'false' } })
      ssmClientMock.on(PutParameterCommand).resolves({ Version: 2 })

      const result = await setNlpSearchStatus(snsEvent)

      expect(result).toEqual({
        parameterName: '/earthdata-search/test/nlp-search-disabled',
        updated: true,
        value: 'true'
      })

      const putCalls = ssmClientMock.commandCalls(PutParameterCommand)
      expect(putCalls).toHaveLength(1)
      expect(putCalls[0].args[0].input).toEqual({
        Name: '/earthdata-search/test/nlp-search-disabled',
        Overwrite: true,
        Type: 'String',
        Value: 'true'
      })

      expect(consoleMock).toHaveBeenCalledTimes(3)
      expect(consoleMock).toHaveBeenNthCalledWith(1, 'Received budget notification: AWS Budgets: earthdata-search-test-bedrock has exceeded your alert threshold')
      expect(consoleMock).toHaveBeenNthCalledWith(2, 'Budget notification message')
      expect(consoleMock).toHaveBeenNthCalledWith(3, 'Set SSM parameter /earthdata-search/test/nlp-search-disabled to true, NLP search has been disabled')
    })

    describe('when NLP search is already disabled', () => {
      test('does not update the SSM parameter', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => {})

        ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'true' } })

        const result = await setNlpSearchStatus(snsEvent)

        expect(result).toEqual({
          parameterName: '/earthdata-search/test/nlp-search-disabled',
          updated: false,
          value: 'true'
        })

        expect(ssmClientMock.commandCalls(PutParameterCommand)).toHaveLength(0)
      })
    })
  })

  describe('when triggered by the monthly schedule', () => {
    test('sets the NLP search disabled SSM parameter to false', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'true' } })
      ssmClientMock.on(PutParameterCommand).resolves({ Version: 3 })

      const result = await setNlpSearchStatus({ action: 'enable' })

      expect(result).toEqual({
        parameterName: '/earthdata-search/test/nlp-search-disabled',
        updated: true,
        value: 'false'
      })

      const getCalls = ssmClientMock.commandCalls(GetParameterCommand)
      expect(getCalls).toHaveLength(1)
      expect(getCalls[0].args[0].input).toEqual({
        Name: '/earthdata-search/test/nlp-search-disabled'
      })

      const putCalls = ssmClientMock.commandCalls(PutParameterCommand)
      expect(putCalls).toHaveLength(1)
      expect(putCalls[0].args[0].input).toEqual({
        Name: '/earthdata-search/test/nlp-search-disabled',
        Overwrite: true,
        Type: 'String',
        Value: 'false'
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Set SSM parameter /earthdata-search/test/nlp-search-disabled to false, NLP search has been enabled')
    })

    describe('when NLP search is already enabled', () => {
      test('does not update the SSM parameter', async () => {
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

        ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'false' } })

        const result = await setNlpSearchStatus({ action: 'enable' })

        expect(result).toEqual({
          parameterName: '/earthdata-search/test/nlp-search-disabled',
          updated: false,
          value: 'false'
        })

        expect(ssmClientMock.commandCalls(PutParameterCommand)).toHaveLength(0)

        expect(consoleMock).toHaveBeenCalledTimes(1)
        expect(consoleMock).toHaveBeenCalledWith('SSM parameter /earthdata-search/test/nlp-search-disabled is already set to false, no update needed')
      })
    })
  })

  describe('when the event is not recognized', () => {
    test('does not read or update the SSM parameter', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = await setNlpSearchStatus({ foo: 'bar' })

      expect(result).toEqual({
        parameterName: '/earthdata-search/test/nlp-search-disabled',
        updated: false
      })

      expect(ssmClientMock.commandCalls(GetParameterCommand)).toHaveLength(0)
      expect(ssmClientMock.commandCalls(PutParameterCommand)).toHaveLength(0)

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Unrecognized event, no action taken:', '{"foo":"bar"}')
    })
  })

  describe('when the SSM parameter cannot be written', () => {
    test('throws an error', async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      ssmClientMock.on(GetParameterCommand).resolves({ Parameter: { Value: 'false' } })
      ssmClientMock.on(PutParameterCommand).rejects(new Error('AccessDenied'))

      await expect(setNlpSearchStatus(snsEvent)).rejects.toThrow('AccessDenied')
    })
  })
})
