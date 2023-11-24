import sharp from 'sharp'

import { resizeImage } from '../resizeImage'

describe('resizeImage', () => {
  test('does not call resize if no height or width was provided', async () => {
    const buffer = Buffer.from('')

    await resizeImage(buffer)

    expect(sharp).toHaveBeenCalledWith(buffer)
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('calls resize when only a height was provided', async () => {
    const buffer = Buffer.from('')

    await resizeImage(buffer, 200)

    expect(sharp).toHaveBeenCalledWith(buffer)
    expect(sharp().resize).toHaveBeenCalledWith(null, 200, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('calls resize when only a width was provided', async () => {
    const buffer = Buffer.from('')

    await resizeImage(buffer, null, 200)

    expect(sharp).toHaveBeenCalledWith(buffer)
    expect(sharp().resize).toHaveBeenCalledWith(200, null, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('does not call resize if no height or width was provided', async () => {
    const buffer = Buffer.from('')

    await resizeImage(buffer, 200, 200)

    expect(sharp).toHaveBeenCalledWith(buffer)
    expect(sharp().resize).toHaveBeenCalledWith(200, 200, { fit: 'inside' })
    expect(sharp().toFormat).toHaveBeenCalledWith('png')
  })

  test('logs and rethrows errors when they occur', async () => {
    const buffer = Buffer.from('')

    sharp.mockImplementation(() => {
      throw new Error('Corrupt image')
    })

    const resizedImage = resizeImage(buffer)

    await expect(resizedImage).rejects.toThrow()
  })
})
