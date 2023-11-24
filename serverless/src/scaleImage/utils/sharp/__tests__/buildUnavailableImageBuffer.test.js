import sharp from 'sharp'

import { buildUnavailableImageBuffer } from '../buildUnavailableImageBuffer'

describe('buildUnavailableImageBuffer', () => {
  const imageUnavailablePath = 'static/src/assets/images/image-unavailable.svg'
  test('retrieves and formats the unavailable image', async () => {
    await buildUnavailableImageBuffer()

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })
})
