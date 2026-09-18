/**
 * Validates a redirect URL against an allow-list of trusted origins and safe protocols.
 * Neutralizes Open Redirect vulnerabilities (like domain.evil.com, @ bypasses, and javascript: links).
 *
 * Prefer passing a relative application path (e.g. '/search?q=...') whenever the
 * caller controls the destination - it can only resolve within edscHost and never
 * needs the origin-allowlist check below. Absolute URLs are supported because EDSC's
 * OAuth callback flow requires redirecting back from an external provider, but they
 * are held to the same allowlist as relative paths once parsed.
 *
 * edscHost is expected to be a trusted, app-controlled config value (e.g. from an
 * environment variable) - never pass a value derived from user input, since it
 * defines the allowlist itself rather than being checked against it.
 *
 * @param {string} inputUrl - The untrusted redirect URL provided in the query params.
 * @param {string} edscHost - The trusted EDSC host environment variable.
 * @returns {string|null} - A safely parsed absolute URL, or null if validation fails.
 */
export const getSafeRedirectUrl = (inputUrl, edscHost) => {
  if (!inputUrl) return null

  try {
    const parsedEdsc = new URL(edscHost)

    // `new URL()` is the platform URL parser (WHATWG URL Standard). Parsing before
    // making any authorization decision - rather than pattern-matching the raw
    // string - is what neutralizes backslash-authority tricks, protocol-relative
    // URLs (//evil.com), and encoded delimiters: the parser normalizes all of
    // these into structured fields (protocol, username, password, host, origin)
    // before we ever compare anything. Do not replace this with
    // String.startsWith()/includes()/regex on the raw input string - those check
    // for a substring match and don't understand URL syntax, so they can be
    // defeated by exactly the payloads this function is tested against below.
    const destination = new URL(inputUrl, edscHost)

    // Reject any credentials embedded in the authority component, e.g.
    // https://trusted.example@attacker.example/ (userinfo "trusted.example",
    // real host "attacker.example") or https://attacker.example:x@trusted.example/
    // (real host is trusted, but a raw credential was still smuggled through).
    // Checked independently of the origin comparison below since origin doesn't
    // include userinfo, and we want to refuse *any* embedded credential outright.
    // THIS MUST HAPPEN FIRST to prevent custom protocol bypasses.
    if (destination.username !== '' || destination.password !== '') return null

    // Allows intended custom desktop application protocol scheme, example: earthdata-download://authCallback
    // This scheme has no host/origin comparable to edscHost, so it's handled
    // before the origin-allowlist check below rather than folded into it.
    if (destination.protocol === 'earthdata-download:') return destination.href

    // Create the allowlist based on the exact origins of the trusted environment variables.
    // By using .origin, this automatically enforces https:// in production environments,
    // but safely allows http:// during local development if the edscHost is configured as http://.
    const trustedOrigins = new Set([parsedEdsc.origin])

    // Addresses Open Redirect and Phishing by comparing the full parsed `origin`
    // against this allowlist of exact origins, rather than comparing hostname alone.
    if (!trustedOrigins.has(destination.origin)) return null

    return destination.href
  } catch {
    // If the URL is completely unparseable/malformed, return null
    return null
  }
}
