import sharp from 'sharp'

import { buildUnavailableImageBuffer } from '../buildUnavailableImageBuffer'

describe('buildUnavailableImageBuffer', () => {
  const imageUnavailablePath = 'static/src/assets/images/image-unavailable.svg'
  test('retrieves and formats the unavailable image', async () => {
    await buildUnavailableImageBuffer()

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('retrieves, resizes and formats the unavailable image', async () => {
    buildUnavailableImageBuffer(200, 200)

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().resize).toHaveBeenCalledWith(200, 200, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('retrieves, resizes and formats the unavailable image', async () => {
    buildUnavailableImageBuffer()

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })
})
