import ValidationSchema from '../validationSchema'

describe('validationSchema', () => {
  test('returns true for an empty form', async () => {
    const valid = await ValidationSchema({}).isValid({})

    expect(valid).toBeTruthy()
  })

  describe('tilingSystem', () => {
    test('validates as a string', async () => {
      const valid = await ValidationSchema({}).isValid({
        tilingSystem: 'Test',
        gridCoords: '1,2,3'
      })

      expect(valid).toBeTruthy()
    })
  })

  describe('gridCoords', () => {
    test('returns true when gridCoords are present', async () => {
      const valid = await ValidationSchema({}).isValid({
        tilingSystem: 'Test',
        gridCoords: '1,2,3'
      })

      expect(valid).toBeTruthy()
    })

    test('returns false when tilingSystem is present and gridCoords are not', async () => {
      const valid = await ValidationSchema({}).isValid({
        tilingSystem: 'Test'
      })

      expect(valid).toBeFalsy()
    })
  })

  describe('cloudCover', () => {
    test('returns true when min is present and max is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        cloudCover: {
          min: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when max is present and min is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        cloudCover: {
          max: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when min is less than max', async () => {
      const valid = await ValidationSchema({}).isValid({
        cloudCover: {
          min: '40',
          max: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns false when max is less than min', async () => {
      const valid = await ValidationSchema({}).isValid({
        cloudCover: {
          min: '50',
          max: '42'
        }
      })

      expect(valid).toBeFalsy()
    })
  })

  describe('equatorCrossingLongitude', () => {
    test('returns true when min is present and max is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingLongitude: {
          min: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when max is present and min is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingLongitude: {
          max: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when min is less than max', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingLongitude: {
          min: '40',
          max: '42'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns false when max is less than min', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingLongitude: {
          min: '50',
          max: '42'
        }
      })

      expect(valid).toBeFalsy()
    })
  })

  describe('equatorCrossingDate', () => {
    test('returns true when startDate is present and endDate is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingDate: {
          startDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when endDate is present and startDate is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingDate: {
          endDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when startDate is before than endDate', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingDate: {
          startDate: '2020-11-01T00:00:00Z',
          endDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns false when endDate is before than startDate', async () => {
      const valid = await ValidationSchema({}).isValid({
        equatorCrossingDate: {
          startDate: '2020-12-01T00:00:00Z',
          endDate: '2020-11-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })

    test('returns false when the startDate is outside the range', async () => {
      const valid = await ValidationSchema({
        temporal: {
          startDate: '2020-01-01T00:00:00Z',
          endDate: '2020-12-31T00:00:00Z'
        }
      }).isValid({
        equatorCrossingDate: {
          startDate: '2000-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })

    test('returns false when the endDate is outside the range', async () => {
      const valid = await ValidationSchema({
        temporal: {
          startDate: '2020-01-01T00:00:00Z',
          endDate: '2020-12-31T00:00:00Z'
        }
      }).isValid({
        equatorCrossingDate: {
          endDate: '2021-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })
  })

  describe('temporal', () => {
    test('returns true when startDate is present and endDate is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        temporal: {
          startDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when endDate is present and startDate is not', async () => {
      const valid = await ValidationSchema({}).isValid({
        temporal: {
          endDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns true when startDate is before than endDate', async () => {
      const valid = await ValidationSchema({}).isValid({
        temporal: {
          startDate: '2020-11-01T00:00:00Z',
          endDate: '2020-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeTruthy()
    })

    test('returns false when endDate is before than startDate', async () => {
      const valid = await ValidationSchema({}).isValid({
        temporal: {
          startDate: '2020-12-01T00:00:00Z',
          endDate: '2020-11-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })

    test('returns false when the startDate is outside the range', async () => {
      const valid = await ValidationSchema({
        temporal: {
          startDate: '2020-01-01T00:00:00Z',
          endDate: '2020-12-31T00:00:00Z'
        }
      }).isValid({
        temporal: {
          startDate: '2000-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })

    test('returns false when the endDate is outside the range', async () => {
      const valid = await ValidationSchema({
        temporal: {
          startDate: '2020-01-01T00:00:00Z',
          endDate: '2020-12-31T00:00:00Z'
        }
      }).isValid({
        temporal: {
          endDate: '2021-12-01T00:00:00Z'
        }
      })

      expect(valid).toBeFalsy()
    })
  })

  describe('readableGranuleName', () => {
    test('validates as a string', async () => {
      const valid = await ValidationSchema({}).isValid({
        readableGranuleName: 'mock granule name'
      })

      expect(valid).toBeTruthy()
    })
  })
})
