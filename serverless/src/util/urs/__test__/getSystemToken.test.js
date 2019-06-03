import { getSystemToken } from '../getSystemToken'

describe('util#getSystemToken', async () => {
  test('correctly returns the cmr token when one is already set', async () => {
    const token = '1234-abcd-5678-efgh'
    const tokenResponse = await getSystemToken(token)

    expect(tokenResponse).toEqual('1234-abcd-5678-efgh')
  })
})
