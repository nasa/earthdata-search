import nock from 'nock'

import { downloadImageFromSource } from '../downloadImageFromSource'

describe('downloadImageFromSource', () => {
  test('returns image buffer when source responds successfully', async () => {
    const responseImage = Buffer.from('SGVsbG8gV29ybGQ=', 'base64')
    nock(/example/)
      .get(/jpg/)
      .reply(200, responseImage)

    const response = await downloadImageFromSource('http://example.com/image.jpg')

    expect(response).toEqual(responseImage)
  })

  test('returns image buffer when source responds successfully', async () => {
    const responseImage = Buffer.from('SGVsbG8gV29ybGQ=', 'base64')
    nock(/example/)
      .get(/jpg/)
      .reply(500, responseImage)

    const response = await downloadImageFromSource('http://example.com/image.jpg')

    expect(response).toEqual(undefined)
  })
})
