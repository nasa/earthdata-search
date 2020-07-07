import { isAccessMethodValid, validAccessMethod } from '../accessMethods'

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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: true
    })
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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: false
    })
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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: false
    })
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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: false
    })
  })

  test('returns false if no project collection config exists', () => {
    const projectCollection = undefined

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: false
    })
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
      granules: {
        hits: 1
      },
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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: true
    })
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

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: true
    })
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
      ...validAccessMethod,
      valid: false,
      tooManyGranules: true
    })
  })

  test('returns false if the granule count is zero', () => {
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
              limit: 100
            }
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collection)).toEqual({
      ...validAccessMethod,
      valid: false,
      noGranules: true
    })
  })

  describe('if added granules exist', () => {
    test('returns true if the added granule count is under the limit', () => {
      const projectCollection = {
        addedGranuleIds: ['GRANULE-1', 'GRANULE-2'],
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
                limit: 2
              }
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collection)).toEqual(validAccessMethod)
    })

    test('returns false if the added granule count is over the limit', () => {
      const projectCollection = {
        addedGranuleIds: ['GRANULE-1', 'GRANULE-2', 'GRANULE-3'],
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
                limit: 2
              }
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collection)).toEqual({
        ...validAccessMethod,
        valid: false,
        tooManyGranules: true
      })
    })
  })

  describe('if removed granules exist', () => {
    test('returns true if the count is under the limit', () => {
      const projectCollection = {
        removedGranuleIds: ['GRANULE-1', 'GRANULE-2'],
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
          hits: 151
        },
        metadata: {
          tags: {
            'edsc.limited_collections': {
              data: {
                limit: 150
              }
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collection)).toEqual(validAccessMethod)
    })

    test('returns false if the count is over the limit', () => {
      const projectCollection = {
        removedGranuleIds: ['GRANULE-1', 'GRANULE-2'],
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
          hits: 153
        },
        metadata: {
          tags: {
            'edsc.limited_collections': {
              data: {
                limit: 150
              }
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collection)).toEqual({
        ...validAccessMethod,
        valid: false,
        tooManyGranules: true
      })
    })
  })
})
