import { calculateTotalSize } from '../calculateTotalSize'

describe('calculateTotalSize', () => {
  test('returns the correct value', () => {
    const granules = [{
      granule_size: '1'
    }, {
      granule_size: '0.97'
    }, {
      granule_size: '1.2'
    }, {
      granule_size: '1.05'
    }]
    const hits = 500

    expect(calculateTotalSize(granules, hits)).toEqual({
      size: '527.5',
      unit: 'MB'
    })
  })

  test('returns NaN when no granules exist', () => {
    const granules = []
    const hits = 500

    expect(calculateTotalSize(granules, hits)).toEqual({
      size: 'NaN',
      unit: 'MB'
    })
  })
})
