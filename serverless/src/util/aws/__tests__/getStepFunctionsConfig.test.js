import { getStepFunctionsConfig } from '../getStepFunctionsConfig'

describe('getStepFunctionsConfig', () => {
  test('returns the app sqs configuration', () => {
    expect(getStepFunctionsConfig()).toEqual({
      apiVersion: '2016-11-23'
    })
  })
})
