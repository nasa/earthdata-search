import isAccessMethodValid from '../accessMethods'

describe('isAccessMethodValid', () => {
  const collection = {
    granules: {
      hits: 150
    },
    metadata: {
      tags: {}
    }
  }

  test('returns true is selected method is valid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: true })
  })

  test('returns false if the selected method is not valid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: false,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: false })
  })

  test('returns false if the selected method does not have isValid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: false })
  })

  test('returns false if no access method is selected', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: false })
  })

  test('returns false if no project collection config exists', () => {
    const projectCollection = undefined

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: false })
  })

  test('returns true if the granule count is under the limit', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    const collection = {
      granules: {},
      metadata: {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 200
            }
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: true })
  })

  test('returns true if there is no granule limit', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({ valid: true })
  })

  test('returns false if the granule count is over the limit', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    const collection = {
      granules: {
        hits: 150
      },
      metadata: {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 100
            }
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      valid: false,
      tooManyGranules: true
    })
  })
})
