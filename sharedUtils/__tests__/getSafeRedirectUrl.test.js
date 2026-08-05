import { getSafeRedirectUrl } from '../getSafeRedirectUrl'

describe('getSafeRedirectUrl', () => {
  const edscHost = 'https://search.earthdata.nasa.gov'

  describe('Standard Redirects (Intended Passes)', () => {
    test('allows relative root path', () => {
      const redirect = '/'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBe('http://localhost:3000/')
    })

    test('allows exact match of trusted edscHost', () => {
      const redirect = 'https://search.earthdata.nasa.gov'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBe('https://search.earthdata.nasa.gov/')
    })

    test('allows deep links on the trusted edscHost', () => {
      const redirect = 'https://search.earthdata.nasa.gov/projects/123'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBe('https://search.earthdata.nasa.gov/projects/123')
    })
  })

  describe('Earthdata Download (EDD) Redirects (Intended Passes)', () => {
    test('allows earthdata-download:// custom protocol for authCallback', () => {
      const redirect = 'earthdata-download://authCallback'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBe('earthdata-download://authCallback')
    })

    test('allows earthdata-download:// custom protocol for eulaCallback', () => {
      const redirect = 'earthdata-download://eulaCallback'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBe('earthdata-download://eulaCallback')
    })
  })

  describe('Bypassing the edscHost check (Vulnerable Bypasses to Block)', () => {
    test('rejects domains that append to the trusted host string (.evil.com)', () => {
      const redirect = 'https://search.earthdata.nasa.gov.evil.com'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('rejects URLs using the trusted host as a username (@ trick)', () => {
      const redirect = 'https://search.earthdata.nasa.gov@evil.com'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('rejects URLs using the trusted host and port as a username (@ trick)', () => {
      const redirect = 'https://search.earthdata.nasa.gov:8080@evil.com'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })
  })

  describe('Bypassing the earthdata-download check (Vulnerable Bypasses to Block)', () => {
    test('rejects absolute URLs spoofing the earthdata-download name as a domain', () => {
      const redirect = 'https://earthdata-download.evil.com'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('rejects absolute URLs using the earthdata-download name as a username (@ trick)', () => {
      const redirect = 'https://earthdata-download@evil.com'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })
  })

  describe('Additional Protocol and Credentials Protections', () => {
    test('rejects unapproved protocols to prevent XSS and scheme attacks', () => {
      const redirect = 'ftp://attacker.com/malicious-file'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('rejects data: protocols', () => {
      const redirect = 'data:text/html,<script>alert(1)</script>'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })
  })

  describe('Error Handling and Malformed URLs', () => {
    test('logs an error and continues safely if edscHost is malformed', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const redirect = '/'
      const brokenEdscHost = 'not-a-valid-url'

      const response = getSafeRedirectUrl(redirect, brokenEdscHost)

      expect(consoleSpy).toHaveBeenCalledWith('Invalid edscHost configured:', brokenEdscHost)

      // Expect the function to have survived the crash and still successfully parsed the valid inputUrl
      expect(response).toBe('http://localhost:3000/')

      consoleSpy.mockRestore()
    })

    test('returns null if the inputUrl is completely unparseable', () => {
      const redirect = 'https://[invalid-bracket-format]'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('returns null if inputUrl is missing or falsy', () => {
      const response = getSafeRedirectUrl('', edscHost)

      expect(response).toBeNull()
    })

    test('validates successfully using only local hostname if edscHost is missing', () => {
      const redirect = '/'

      const response = getSafeRedirectUrl(redirect, undefined)

      expect(response).toBe('http://localhost:3000/')
    })
  })
})
