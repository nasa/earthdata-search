import HarmonyCapabilitiesRequest from '../harmonyCapabilitiesDocumentRequest'

describe('HarmonyCapabilitiesDocumentRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new HarmonyCapabilitiesRequest(token, 'prod')

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
    expect(request.baseUrl).toEqual('https://harmony.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('capabilities')
  })

  describe('#search', () => {
    test('calls getSearch with the provided parameters', () => {
      const token = '123'
      const request = new HarmonyCapabilitiesRequest(token, 'prod')

      // Spy on the inherited getSearch method
      const getSearchSpy = vi.spyOn(request, 'getSearch').mockImplementation(() => Promise.resolve({ data: 'mockData' }))

      const params = {
        collectionId: 'collectionId',
        version: '3'
      }

      request.search(params)

      expect(getSearchSpy).toHaveBeenCalledTimes(1)
      expect(getSearchSpy).toHaveBeenCalledWith(params)
    })
  })
})
