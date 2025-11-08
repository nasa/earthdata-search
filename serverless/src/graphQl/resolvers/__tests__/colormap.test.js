import setupServer from './__mocks__/setupServer'

import GET_COLORMAPS from '../../../../../static/src/js/operations/queries/getColorMaps'

describe('Colormap Resolver', () => {
  describe('Query', () => {
    describe('colormaps', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getColorMapsByProducts: jest.fn().mockResolvedValue([{
            product: 'test-product',
            jsondata: { scale: { colors: ['#ff0000'] } },
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
            product: 'test-product',
            jsondata: { scale: { colors: ['#ff0000'] } },
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
