import { getSqsConfig } from '../getSqsConfig'

describe('getSqsConfig', () => {
  test('returns the app sqs configuration', () => {
    expect(getSqsConfig()).toEqual({
      apiVersion: '2012-11-05'
    })
  })
})
