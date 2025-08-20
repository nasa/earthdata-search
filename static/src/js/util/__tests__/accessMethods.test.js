import { isAccessMethodValid, validAccessMethod } from '../accessMethods'

describe('isAccessMethodValid', () => {
  const collection = {
    tags: {}
  }

  test('returns true is selected method is valid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      granules: {
        count: 150
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
      granules: {
        count: 150
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
      granules: {
        count: 150
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
      },
      granules: {
        count: 150
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
      granules: {
        count: 1
      },
      selectedAccessMethod: 'download'
    }

    const collectionWithTags = {
      tags: {
        'edsc.limited_collections': {
          data: {
            limit: 200
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual({
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
      granules: {
        count: 150
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
      granules: {
        count: 150
      },
      selectedAccessMethod: 'download'
    }

    const collectionWithTags = {
      tags: {
        'edsc.limited_collections': {
          data: {
            limit: 100
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual({
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
      granules: {
        count: 0
      },
      selectedAccessMethod: 'download'
    }

    const collectionWithTags = {
      tags: {
        'edsc.limited_collections': {
          data: {
            limit: 100
          }
        }
      }
    }

    expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual({
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
        granules: {
          count: 1
        },
        selectedAccessMethod: 'download'
      }

      const collectionWithTags = {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 2
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual(validAccessMethod)
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
        granules: {
          count: 150
        },
        selectedAccessMethod: 'download'
      }

      const collectionWithTags = {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 2
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual({
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
        granules: {
          count: 140
        },
        selectedAccessMethod: 'download'
      }

      const collectionWithTags = {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 150
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual(validAccessMethod)
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
        granules: {
          count: 153
        },
        selectedAccessMethod: 'download'
      }

      const collectionWithTags = {
        tags: {
          'edsc.limited_collections': {
            data: {
              limit: 150
            }
          }
        }
      }

      expect(isAccessMethodValid(projectCollection, collectionWithTags)).toEqual({
        ...validAccessMethod,
        valid: false,
        tooManyGranules: true
      })
    })
  })

  describe('when there are specific rules for an access method', () => {
    describe('when selected access method is Swodlr and granule count is > 10', () => {
      test('returns false', () => {
        const projectCollection = {
          accessMethods: {
            accessMethods: {
              swodlr: {
                isValid: true
              }
            }
          },
          granules: {
            count: 150
          },
          selectedAccessMethod: 'swodlr'
        }

        expect(isAccessMethodValid(projectCollection, collection)).toEqual({
          ...validAccessMethod,
          valid: false
        })
      })
    })

    describe('when selected access method is Swodlr and granule count is <= 10', () => {
      test('returns true', () => {
        const projectCollection = {
          accessMethods: {
            swodlr: {
              isValid: true
            }
          },
          granules: {
            count: 5
          },
          selectedAccessMethod: 'swodlr'
        }

        expect(isAccessMethodValid(projectCollection, collection)).toEqual({
          ...validAccessMethod,
          valid: true
        })
      })
    })

    describe('when selected access method is esi and project has not changed', () => {
      test('returns false', () => {
        const projectCollection = {
          accessMethods: {
            esi0: {
              type: 'ESI',
              url: 'https://esi/test',
              isValid: false,
              hasChanged: false
            }
          },
          granules: {
            count: 5
          },
          selectedAccessMethod: 'esi0'
        }

        expect(isAccessMethodValid(projectCollection, collection)).toEqual({
          ...validAccessMethod,
          valid: false,
          needsCustomization: true
        })
      })
    })

    describe('when selected access method is esi and project has changed', () => {
      test('returns true', () => {
        const projectCollection = {
          accessMethods: {
            esi0: {
              type: 'ESI',
              url: 'https://esi/test',
              isValid: true,
              hasChanged: true
            }
          },
          granules: {
            count: 5
          },
          selectedAccessMethod: 'esi0'
        }

        expect(isAccessMethodValid(projectCollection, collection)).toEqual({
          ...validAccessMethod,
          valid: true,
          needsCustomization: false
        })
      })
    })
  })
})
