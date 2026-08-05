/**
 * Validates a redirect URL against an allow-list of trusted hosts and safe protocols.
 * Neutralizes Open Redirect vulnerabilities (like domain.evil.com, @ bypasses, and javascript: links).
 *
 * @param {string} inputUrl - The untrusted redirect URL provided in the query params.
 * @param {string} edscHost - The trusted EDSC host environment variable.
 * @returns {string|null} - A safely parsed absolute URL, or null if validation fails.
 */
export const getSafeRedirectUrl = (inputUrl, edscHost) => {
  if (!inputUrl) return null

  try {
    const parsedUrl = new URL(inputUrl, window.location.origin)

    // Addresses Open Redirect via URL User-Information syntax
    if (parsedUrl.username !== '' || parsedUrl.password !== '') return null

    // Allows intended custom desktop application protocol scheme, example: earthdata-download://authCallback
    if (parsedUrl.protocol === 'earthdata-download:') return parsedUrl.href

    // Addresses Cross-Site Scripting (XSS) via URI schemes
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return null

    const trustedHostnames = [window.location.hostname]

    // Parse the configured edscHost environment variable and add it to our trusted hostnames allow-list
    if (edscHost) {
      try {
        const parsedEdsc = new URL(edscHost)
        trustedHostnames.push(parsedEdsc.hostname)
      } catch {
        console.error('Invalid edscHost configured:', edscHost)
      }
    }

    // Addresses Open Redirect and Phishing
    if (!trustedHostnames.includes(parsedUrl.hostname)) return null

    return parsedUrl.href
  } catch {
    // If the URL is completely unparseable/malformed, return null
    return null
  }
}
