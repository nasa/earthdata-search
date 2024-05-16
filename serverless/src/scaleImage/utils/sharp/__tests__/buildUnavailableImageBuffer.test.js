import sharp from 'sharp'

import { buildUnavailableImageBuffer } from '../buildUnavailableImageBuffer'

describe('buildUnavailableImageBuffer', () => {
  test('retrieves and formats the unavailable image', async () => {
    await buildUnavailableImageBuffer()

    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('retrieves, resizes and formats the unavailable image', async () => {
    buildUnavailableImageBuffer(200, 200)

    expect(sharp().resize).toHaveBeenCalledWith(200, 200, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('retrieves, resizes and formats the unavailable image', async () => {
    buildUnavailableImageBuffer()

    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })
})
