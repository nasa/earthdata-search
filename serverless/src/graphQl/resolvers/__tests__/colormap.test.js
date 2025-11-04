import setupServer from './__mocks__/setupServer'

import GET_COLORMAPS from '../../../../../static/src/js/operations/queries/getColorMaps'

describe('Colormap Resolver', () => {
  describe('Query', () => {
    describe('colormaps', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getColorMapsByProducts: jest.fn().mockResolvedValue([{
            id: 1,
            product: 'test-product',
            url: 'https://example.com/colormap',
            jsondata: { scale: { colors: ['#ff0000'] } },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          }])
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_COLORMAPS,
          variables: { products: ['test-product'] }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getColorMapsByProducts).toHaveBeenCalledWith(['test-product'])
        expect(databaseClient.getColorMapsByProducts).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          colormaps: [{
            id: 1,
            product: 'test-product',
            url: 'https://example.com/colormap',
            jsondata: { scale: { colors: ['#ff0000'] } },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          }]
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getColorMapsByProducts: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_COLORMAPS,
          variables: { products: ['test-product'] }
        }, {
          contextValue
        })
        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'
        expect(errors[0].message).toEqual(errorMessage)
        expect(data).toEqual({
          colormaps: null
        })
      })
    })
  })
})
