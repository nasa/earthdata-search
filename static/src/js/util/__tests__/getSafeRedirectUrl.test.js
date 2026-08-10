import { getSafeRedirectUrl } from '../getSafeRedirectUrl'

describe('getSafeRedirectUrl', () => {
  const edscHost = 'https://search.earthdata.nasa.gov'

  describe('Standard Redirects (Intended Passes)', () => {
    test('allows relative root path based on edscHost', () => {
      const redirect = '/'
      const response = getSafeRedirectUrl(redirect, edscHost)

      // Because edscHost is now the base URL, relative paths map directly to it!
      expect(response).toBe('https://search.earthdata.nasa.gov/')
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

  describe('Environment Protocol Checks (HTTP vs HTTPS)', () => {
    test('rejects http: redirects if edscHost is https: (Production protection)', () => {
      const redirect = 'http://search.earthdata.nasa.gov/projects'
      const response = getSafeRedirectUrl(redirect, edscHost)

      expect(response).toBeNull()
    })

    test('allows http: redirects if edscHost is http: (Local Development)', () => {
      const localHost = 'http://localhost:8080'
      const redirect = 'http://localhost:8080/search'
      const response = getSafeRedirectUrl(redirect, localHost)

      expect(response).toBe('http://localhost:8080/search')
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

  describe('Error Handling and Malformed Inputs', () => {
    test('returns null if edscHost is malformed', () => {
      const redirect = '/'
      const brokenEdscHost = 'not-a-valid-url'

      const response = getSafeRedirectUrl(redirect, brokenEdscHost)

      expect(response).toBeNull()
    })

    test('returns null if edscHost is missing or undefined', () => {
      const redirect = '/'

      const response = getSafeRedirectUrl(redirect, undefined)

      expect(response).toBeNull()
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
  })
})
