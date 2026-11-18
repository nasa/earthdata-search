import { preserveAnalyticsParams } from '../preserveAnalyticsParams'

describe('preserveAnalyticsParams', () => {
  test('preserves arbitrary UTM keys and click IDs without carrying over unrelated parameters', () => {
    const result = preserveAnalyticsParams(
      '?q=old&utm_source=mcp&utm_custom=value&GCLID=click&DcLiD=display&UTM_CAMPAIGN=launch&other=discarded',
      'q=clouds&qt=start%3Aend%2Cfinish'
    )

    expect(result).toEqual(
      'q=clouds&qt=start%3Aend%2Cfinish&utm_source=mcp&utm_custom=value&GCLID=click&DcLiD=display&UTM_CAMPAIGN=launch'
    )
  })

  test('keeps new values, including explicit empty values, instead of restoring old values', () => {
    const result = preserveAnalyticsParams(
      '?utm_source=old&gclid=old-click&dclid=display',
      '?utm_source=new&gclid='
    )

    expect(result).toEqual('?utm_source=new&gclid=&dclid=display')
  })

  test('preserves encoded analytics values when the new query is empty', () => {
    const result = preserveAnalyticsParams('?utm_source=earthdata%26mcp%2Btest', '')

    expect(result).toEqual('utm_source=earthdata%26mcp%2Btest')
  })

})
