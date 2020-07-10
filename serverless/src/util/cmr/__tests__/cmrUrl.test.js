import { cmrUrl } from '../cmrUrl'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
})

/**
 * Because CMR does not support using POST to query the service endpoint
 * we have to chunk our requests, the current page size is set to 500
 */
describe('cmrUrl', () => {
  beforeEach(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
  })

  test('properly constructs a url without query params', async () => {
    const url = cmrUrl('search')

    expect(url).toBe('http://example.com/search')
  })

  test('properly constructs a url with query params', async () => {
    const url = cmrUrl('search', { testParam: true })

    expect(url).toBe('http://example.com/search?testParam=true')
  })

  test('properly constructs a url with query params containing an array', async () => {
    const url = cmrUrl('search', { testParam: true, arrayParam: [1, 'two'] })

    expect(url).toBe('http://example.com/search?testParam=true&arrayParam%5B%5D=1&arrayParam%5B%5D=two')
  })
})
