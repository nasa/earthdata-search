import nock from 'nock'

import { getServiceOptionDefinitionIdNamePairs } from '../getServiceOptionDefinitionIdNamePairs'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getServiceOptionDefinitionIdNamePairs', () => {
  test('catches and logs errors correctly', async () => {
    nock(/cmr/)
      .get(/service_option_definitions/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const response = await getServiceOptionDefinitionIdNamePairs('1234-abcd-5678-efgh', ['asdfasdf-abcd-5678-efgh'])

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(1)

    expect(consoleMock.mock.calls[0]).toEqual([
      'Error (500): Test error message'
    ])

    expect(response).toEqual({})
  })
})
