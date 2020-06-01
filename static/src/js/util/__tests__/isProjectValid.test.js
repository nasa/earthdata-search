import { isProjectValid } from '../isProjectValid'
import { validAccessMethod } from '../accessMethods'

describe('isProjectValid', () => {
  describe('when all collections are invalid', () => {
    test('returns false', () => {
      const project = {
        byId: {
          collection1: {
            accessMethods: {}
          },
          collection2: {
            accessMethods: {}
          },
          collection3: {
            accessMethods: {}
          }
        },
        collectionIds: ['collection1', 'collection2', 'collection3']
      }

      const collections = {
        byId: {
          collection1: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection2: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection3: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({
        ...validAccessMethod,
        valid: false
      })
    })
  })

  describe('when some collections are invalid', () => {
    test('returns false', () => {
      const project = {
        byId: {
          collection1: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          },
          collection2: {
            accessMethods: {}
          },
          collection3: {
            accessMethods: {}
          }
        },
        collectionIds: ['collection1', 'collection2', 'collection3']
      }

      const collections = {
        byId: {
          collection1: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection2: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection3: {
            metadata: {
              tags: {}
            },
            granules: {}
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({
        ...validAccessMethod,
        valid: false,
        zeroGranules: true
      })
    })
  })

  describe('when all collections are valid', () => {
    test('returns true', () => {
      const project = {
        byId: {
          collection1: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          },
          collection2: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          },
          collection3: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collection1', 'collection2', 'collection3']
      }

      const collections = {
        byId: {
          collection1: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection2: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          },
          collection3: {
            granules: {
              hits: 1
            },
            metadata: {
              tags: {}
            }
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({
        ...validAccessMethod,
        valid: true
      })
    })
  })

  describe('when there are no collections in the project', () => {
    test('returns false', () => {
      const project = {
        byId: {},
        collectionIds: []
      }

      const collections = {
        byId: {}
      }

      expect(isProjectValid(project, collections)).toEqual({ valid: false })
    })
  })
})
