import NlpSearchRequest from '../nlpSearchRequest'

import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))
vi.spyOn(getEarthdataConfig, 'getEnvironmentConfig').mockImplementation(() => ({ apiHost: 'http://localhost:3001' }))

describe('NlpSearchRequest#constructor', () => {
  test('creates a request object', () => {
    const request = new NlpSearchRequest('prod')

    expect(request).toBeInstanceOf(NlpSearchRequest)
  })
})

describe('NlpSearchRequest#stream', () => {
  test('calls fetch with the apiHost NLP endpoint and encoded query', async () => {
    const request = new NlpSearchRequest('prod')
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true })
    const { signal } = new AbortController()

    await request.stream('ice sheets in greenland', { signal })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/nlp?query=ice%20sheets%20in%20greenland',
      {
        headers: expect.any(Headers),
        method: 'GET',
        signal
      }
    )

    fetchSpy.mockRestore()
  })
})
