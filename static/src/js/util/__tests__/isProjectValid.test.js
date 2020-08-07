import { isProjectValid } from '../isProjectValid'
import { validAccessMethod } from '../accessMethods'

describe('isProjectValid', () => {
  describe('when all collections are invalid', () => {
    test('returns false', () => {
      const project = {
        collections: {
          allIds: ['collection1', 'collection2', 'collection3'],
          byId: {
            collection1: {
              accessMethods: {},
              granules: {
                hits: 1
              }
            },
            collection2: {
              accessMethods: {},
              granules: {
                hits: 1
              }
            },
            collection3: {
              accessMethods: {},
              granules: {
                hits: 1
              }
            }
          }
        }
      }

      const collections = {
        collection1: {
          tags: {}
        },
        collection2: {
          tags: {}
        },
        collection3: {
          tags: {}
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
        collections: {
          allIds: ['collection1', 'collection2', 'collection3'],
          byId: {
            collection1: {
              accessMethods: {
                download: {
                  isValid: true,
                  type: 'download'
                }
              },
              granules: {
                hits: 1
              },
              selectedAccessMethod: 'download'
            },
            collection2: {
              accessMethods: {},
              granules: {
                hits: 1
              }
            },
            collection3: {
              accessMethods: {},
              granules: {
                hits: 0
              }
            }
          }
        }
      }

      const collections = {
        collection1: {
          tags: {}
        },
        collection2: {
          tags: {}
        },
        collection3: {
          tags: {}
        }
      }

      expect(isProjectValid(project, collections)).toEqual({
        ...validAccessMethod,
        valid: false,
        noGranules: true
      })
    })
  })

  describe('when all collections are valid', () => {
    test('returns true', () => {
      const project = {
        collections: {
          allIds: ['collection1', 'collection2', 'collection3'],
          byId: {
            collection1: {
              accessMethods: {
                download: {
                  isValid: true,
                  type: 'download'
                }
              },
              granules: {
                hits: 1
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
              granules: {
                hits: 1
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
              granules: {
                hits: 1
              },
              selectedAccessMethod: 'download'
            }
          }
        }
      }

      const collections = {
        collection1: {
          tags: {}
        },
        collection2: {
          tags: {}
        },
        collection3: {
          tags: {}
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
        collections: {
          allIds: [],
          byId: {}
        }
      }

      const collections = {}

      expect(isProjectValid(project, collections)).toEqual({ valid: false })
    })
  })
})
