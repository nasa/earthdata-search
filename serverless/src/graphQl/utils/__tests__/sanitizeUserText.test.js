import sanitizeUserText from '../sanitizeUserText'

describe('sanitizeUserText', () => {
  test('returns null for null or undefined', () => {
    expect(sanitizeUserText(null)).toBeNull()
    expect(sanitizeUserText(undefined)).toBeNull()
  })

  test('returns null for empty or whitespace-only text', () => {
    expect(sanitizeUserText('')).toBeNull()
    expect(sanitizeUserText('  \n\t ')).toBeNull()
  })

  test('trims surrounding whitespace', () => {
    expect(sanitizeUserText('  wrong location  ')).toEqual('wrong location')
  })

  test('removes null bytes and other control characters', () => {
    expect(sanitizeUserText('wrong\u0000 loc\u0007ation\u001B[31m')).toEqual('wrong location[31m')
  })

  test('keeps tabs and newlines and normalizes line endings', () => {
    expect(sanitizeUserText('line 1\r\nline 2\rline 3\n\tindented')).toEqual('line 1\nline 2\nline 3\n\tindented')
  })

  test('removes bidirectional override characters', () => {
    expect(sanitizeUserText('abc\u202Edcb\u202C \u2066x\u2069')).toEqual('abcdcb x')
  })

  test('returns null when only removed characters remain', () => {
    expect(sanitizeUserText('\u0000\u202E')).toBeNull()
  })

  test('leaves markup untouched, since escaping happens when rendering', () => {
    expect(sanitizeUserText('<script>alert(1)</script>')).toEqual('<script>alert(1)</script>')
  })

  test('applies Unicode NFC normalization', () => {
    expect(sanitizeUserText('cafe\u0301')).toEqual('caf\u00E9')
  })
})
