import HarmonyCapabilitiesRequest from '../harmonyCapabilitiesRequest'

describe('HarmonyCapabilitiesRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new HarmonyCapabilitiesRequest(token, 'prod')

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
    expect(request.baseUrl).toEqual('https://harmony.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('capabilities')
  })
})
