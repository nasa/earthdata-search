import { changeCmrFacet } from '../facets'

beforeEach(() => {
  jest.resetAllMocks()
})

describe('changeCmrFacet', () => {
  test('calls the change handler with the correct arguments', () => {
    const onChangeHandlerMock = jest.fn()

    changeCmrFacet(
      {},
      {
        destination: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?granule_data_format_h%5B%5D=ASCII'
      },
      onChangeHandlerMock,
      {},
      false
    )
    expect(onChangeHandlerMock).toHaveBeenCalledTimes(1)
    expect(onChangeHandlerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        granule_data_format_h: ['ASCII']
      }),
      {},
      false
    )
  })

  describe('when the facet has encoded characters', () => {
    test('does not decode the values', () => {
      const onChangeHandlerMock = jest.fn()

      changeCmrFacet(
        {},
        {
          destination: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?data_center_h%5B%5D=Level-1%2Band%2BAtmosphere%2BArchive%2B%2526%2BDistribution%2BSystem%2B%2528LAADS%2529'
        },
        onChangeHandlerMock,
        {},
        false
      )
      expect(onChangeHandlerMock).toHaveBeenCalledTimes(1)
      expect(onChangeHandlerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data_center_h: ['Level-1%2Band%2BAtmosphere%2BArchive%2B%2526%2BDistribution%2BSystem%2B%2528LAADS%2529']
        }),
        {},
        false
      )
    })
  })
})
