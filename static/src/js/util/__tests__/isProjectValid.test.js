import { isProjectValid } from '../isProjectValid'

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
            metadata: {
              tags: {}
            }
          },
          collection2: {
            metadata: {
              tags: {}
            }
          },
          collection3: {
            metadata: {
              tags: {}
            }
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({ valid: false })
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
            metadata: {
              tags: {}
            }
          },
          collection2: {
            metadata: {
              tags: {}
            }
          },
          collection3: {
            metadata: {
              tags: {}
            }
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({ valid: false })
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
            metadata: {
              tags: {}
            }
          },
          collection2: {
            metadata: {
              tags: {}
            }
          },
          collection3: {
            metadata: {
              tags: {}
            }
          }
        }
      }

      expect(isProjectValid(project, collections)).toEqual({ valid: true })
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
