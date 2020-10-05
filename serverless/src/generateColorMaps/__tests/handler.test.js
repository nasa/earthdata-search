import * as getProjectionCapabilities from '../getProjectionCapabilities'

import generateColorMaps from '../handler'

describe('generateColorMaps', () => {
  describe('on successful retrieval', () => {
    test('responds correctly on http error', async () => {
      jest.spyOn(getProjectionCapabilities, 'getProjectionCapabilities').mockImplementationOnce(() => ({
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 200,
          body: ['VIIRS_SNPP_AOT_Dark_Target_Land_Ocean']
        })
      }))

      const event = {
        body: JSON.stringify({
          requestId: 'asdf-1234-qwer-5678',
          params: {}
        })
      }

      const response = await generateColorMaps(event, {})

      expect(response.statusCode).toEqual(200)

      const { body } = response
      const parsedBody = JSON.parse(body)

      expect(parsedBody).toEqual({
        statusCode: 200,
        body: ['VIIRS_SNPP_AOT_Dark_Target_Land_Ocean']
      })
    })
  })

  describe('on error', () => {
    test('responds correctly on http error', async () => {
      jest.spyOn(getProjectionCapabilities, 'getProjectionCapabilities').mockImplementationOnce(() => ({
        statusCode: 500,
        body: JSON.stringify({
          statusCode: 500,
          errors: ['HTTP Error']
        })
      }))

      const event = {
        body: JSON.stringify({
          requestId: 'asdf-1234-qwer-5678',
          params: {}
        })
      }

      const response = await generateColorMaps(event, {})

      expect(response.statusCode).toEqual(500)

      const { body } = response
      const parsedBody = JSON.parse(body)
      const { errors } = parsedBody
      const [errorMessage] = errors

      expect(errorMessage).toEqual('HTTP Error')
    })
  })
})
