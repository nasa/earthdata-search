import { buildResponse } from '../buildResponse'

describe('buildResponse', () => {
  test('when no status code is provided', () => {
    const imageBuffer = Buffer.from('test-image-contents')

    const response = buildResponse(imageBuffer)

    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: '{"base64Image":"data:image/png;base64, dGVzdC1pbWFnZS1jb250ZW50cw==","Content-Type":"image/png"}'
    })
  })

  test('when a status code is provided', () => {
    const imageBuffer = Buffer.from('')

    const response = buildResponse(imageBuffer, 404)

    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: '{"base64Image":"data:image/png;base64, ","Content-Type":"image/png"}'
    })
  })
})
