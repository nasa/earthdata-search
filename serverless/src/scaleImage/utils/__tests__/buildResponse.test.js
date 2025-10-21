import { buildResponse } from '../buildResponse'

describe('buildResponse', () => {
  test('when no status code is provided', () => {
    const imageBuffer = Buffer.from('test-image-contents')

    const response = buildResponse(imageBuffer)

    expect(response).toEqual({
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=604800, public'
      },
      body: 'dGVzdC1pbWFnZS1jb250ZW50cw=='
    })
  })

  test('when a status code is provided', () => {
    const imageBuffer = Buffer.from('')

    const response = buildResponse(imageBuffer, 404)

    expect(response).toEqual({
      isBase64Encoded: true,
      statusCode: 404,
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=604800, public'
      },
      body: ''
    })
  })
})
