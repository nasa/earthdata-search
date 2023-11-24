import sharp from 'sharp'

import { buildAndResizeUnavailableImageBuffer } from '../buildAndResizeUnavailableImageBuffer'

describe('buildAndResizeUnavailableImageBuffer', () => {
  const imageUnavailablePath = 'static/src/assets/images/image-unavailable.svg'
  test('retrieves, resizes and formats the unavailable image', async () => {
    buildAndResizeUnavailableImageBuffer(200, 200)

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().resize).toHaveBeenCalledWith(200, 200, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('retrieves, resizes and formats the unavailable image', async () => {
    buildAndResizeUnavailableImageBuffer()

    expect(sharp).toHaveBeenCalledWith(imageUnavailablePath)
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })
})
