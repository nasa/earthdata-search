import emptyAccessMethod from '../emptyAccessMethod'

describe('emptyAccessMethod', () => {
  test('returns an empty download method', () => {
    expect(emptyAccessMethod('download')).toEqual({
      download: {
        type: 'download'
      }
    })
  })

  test('returns an empty echo order method', () => {
    expect(emptyAccessMethod('echoOrder')).toEqual({
      echoOrder: {
        type: 'ECHO_ORDER'
      }
    })
  })

  test('returns a download method by default', () => {
    expect(emptyAccessMethod('not a read method')).toEqual({
      download: {
        type: 'download'
      }
    })
  })
})
