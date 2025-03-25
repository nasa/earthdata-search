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

  test('returns undefined when source responds unsuccessfully', async () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    nock(/example/)
      .get(/jpg/)
      .reply(500, 'Failing to return data')

    const response = await downloadImageFromSource('http://example.com/image.jpg')

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Error fetching image from url http://example.com/image.jpg, Failing to return data')

    expect(response).toEqual(undefined)
  })
})
