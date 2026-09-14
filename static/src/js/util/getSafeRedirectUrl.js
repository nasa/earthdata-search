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
 * edscHost and edlHost are both expected to be trusted, app-controlled config values
 * (e.g. from environment variables) - never pass a value derived from user input for
 * either parameter, since they define the allowlist itself rather than being checked
 * against it.
 *
 * @param {string} inputUrl - The untrusted redirect URL provided in the query params.
 * @param {string} edscHost - The trusted EDSC host environment variable.
 * @param {string} [edlHost] - The trusted Earthdata Login host environment variable,
 *   allowed as a second valid redirect origin alongside edscHost. Optional so
 *   existing callers that only need edscHost keep working unchanged.
 * @returns {string|null} - A safely parsed absolute URL, or null if validation fails.
 */
export const getSafeRedirectUrl = (inputUrl, edscHost, edlHost) => {
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

    // Allows intended custom desktop application protocol scheme, example: earthdata-download://authCallback
    // This scheme has no host/origin comparable to edscHost, so it's handled
    // before the origin-allowlist check below rather than folded into it.
    if (destination.protocol === 'earthdata-download:') return destination.href

    // Reject any credentials embedded in the authority component, e.g.
    // https://trusted.example@attacker.example/ (userinfo "trusted.example",
    // real host "attacker.example") or https://attacker.example:x@trusted.example/
    // (real host is trusted, but a raw credential was still smuggled through).
    // Checked independently of the origin comparison below since origin doesn't
    // include userinfo, and we want to refuse *any* embedded credential outright.
    if (destination.username !== '' || destination.password !== '') return null

    // Restrict scheme to https: only - no exception for local development.
    // The allowlist is a set of exact origins (protocol + host + port), so
    // any http: destination is rejected here regardless of what edscHost or
    // edlHost is running on. If local development needs this to work, serve
    // it over https: locally rather than reintroducing an http: exception here.
    const trustedOrigins = new Set([`https://${parsedEdsc.host}`])

    // EdlHost is trusted the same way edscHost is: parsed with the platform
    // parser and added as its own exact origin, never string-matched or used
    // to build the allowlist in any looser way. Parsed in its own try/catch -
    // not the outer one - so a malformed edlHost (e.g. missing the https://
    // protocol in an env var) only means edlHost isn't trusted, rather than
    // aborting validation for every redirect, including ones that only ever
    // needed edscHost and had nothing to do with edlHost.
    if (edlHost) {
      try {
        const parsedEdl = new URL(edlHost)
        trustedOrigins.add(`https://${parsedEdl.host}`)
      } catch {
        // Malformed edlHost: edlHost simply isn't added to the allowlist.
        // Falls through to the origin check below.
      }
    }

    // Addresses Open Redirect and Phishing by comparing the full parsed `origin`
    // against this allowlist of exact origins, rather than comparing hostname alone.
    if (!trustedOrigins.has(destination.origin)) return null

    return destination.href
  } catch {
    // If the URL is completely unparseable/malformed, return null
    return null
  }
}