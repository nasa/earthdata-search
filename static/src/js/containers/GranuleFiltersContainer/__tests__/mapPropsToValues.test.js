import useEdscStore from '../../../zustand/useEdscStore'
import mapPropsToValues from '../mapPropsToValues'

describe('mapPropsToValues', () => {
  describe('when there are no granule query values', () => {
    test('should return the expected values', () => {
      const expected = {
        browseOnly: false,
        cloudCover: {
          max: '',
          min: ''
        },
        dayNightFlag: '',
        equatorCrossingDate: {
          endDate: '',
          startDate: ''
        },
        equatorCrossingLongitude: {
          max: '',
          min: ''
        },
        gridCoords: '',
        onlineOnly: false,
        orbitNumber: {
          max: '',
          min: ''
        },
        readableGranuleName: '',
        temporal: {
          endDate: '',
          isRecurring: false,
          recurringDayEnd: '',
          recurringDayStart: '',
          startDate: ''
        },
        tilingSystem: ''
      }

      const actual = mapPropsToValues()

      expect(actual).toEqual(expected)
    })
  })

  describe('when there are granule query values', () => {
    test('should return the expected values', () => {
      useEdscStore.setState({
        collection: {
          collectionId: 'collectionId'
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  browseOnly: true,
                  cloudCover: {
                    max: '100',
                    min: '0'
                  },
                  dayNightFlag: 'DAY',
                  equatorCrossingDate: {
                    endDate: '2020-01-01T00:00:00Z',
                    startDate: '2020-01-01T00:00:00Z'
                  },
                  equatorCrossingLongitude: {
                    max: '100',
                    min: '0'
                  },
                  gridCoords: 'gridCoords',
                  onlineOnly: true,
                  orbitNumber: {
                    max: '100',
                    min: '0'
                  },
                  readableGranuleName: 'readableGranuleName',
                  temporal: {
                    endDate: '2020-01-01T00:00:00Z',
                    isRecurring: true,
                    recurringDayEnd: '10',
                    recurringDayStart: '1',
                    startDate: '2020-01-01T00:00:00Z'
                  },
                  tilingSystem: 'tilingSystem'
                }
              }
            }
          }
        }
      })

      const expected = {
        browseOnly: true,
        cloudCover: {
          max: '100',
          min: '0'
        },
        dayNightFlag: 'DAY',
        equatorCrossingDate: {
          endDate: '2020-01-01T00:00:00Z',
          startDate: '2020-01-01T00:00:00Z'
        },
        equatorCrossingLongitude: {
          max: '100',
          min: '0'
        },
        gridCoords: 'gridCoords',
        onlineOnly: true,
        orbitNumber: {
          max: '100',
          min: '0'
        },
        readableGranuleName: 'readableGranuleName',
        temporal: {
          endDate: '2020-01-01T00:00:00Z',
          isRecurring: true,
          recurringDayEnd: '10',
          recurringDayStart: '1',
          startDate: '2020-01-01T00:00:00Z'
        },
        tilingSystem: 'tilingSystem'
      }

      const actual = mapPropsToValues()

      expect(actual).toEqual(expected)
    })

    describe('when readableGranuleName is an array', () => {
      test('should join the array values with a comma', () => {
        useEdscStore.setState({
          collection: {
            collectionId: 'collectionId'
          },
          query: {
            collection: {
              byId: {
                collectionId: {
                  granules: {
                    readableGranuleName: ['readableGranuleName1', 'readableGranuleName2']
                  }
                }
              }
            }
          }
        })

        const expected = 'readableGranuleName1,readableGranuleName2'

        const actual = mapPropsToValues().readableGranuleName

        expect(actual).toEqual(expected)
      })
    })
  })
})
