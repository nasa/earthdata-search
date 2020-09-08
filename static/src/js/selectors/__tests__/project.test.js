import {
  getProjectCollectionsMetadata,
  getFocusedProjectCollection,
  getProjectCollectionsRequiringChunking
} from '../project'

describe('getProjectCollectionsMetadata selector', () => {
  test('returns the granule query', () => {
    const state = {
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      project: {
        collections: {
          allIds: ['collectionId']
        }
      }
    }

    expect(getProjectCollectionsMetadata(state)).toEqual({
      collectionId: {
        mock: 'data'
      }
    })
  })

  test('returns an empty object when there are no project collections', () => {
    const state = {
      metadata: {},
      project: {}
    }

    expect(getProjectCollectionsMetadata(state)).toEqual({})
  })
})

describe('getFocusedProjectCollection selector', () => {
  test('returns the granule query', () => {
    const state = {
      focusedCollection: 'collectionId',
      project: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      }
    }

    expect(getFocusedProjectCollection(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      project: {}
    }

    expect(getFocusedProjectCollection(state)).toEqual({})
  })
})

describe('getProjectCollectionsRequiringChunking selector', () => {
  test('returns the granule query', () => {
    const state = {
      project: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                hits: 2001
              }
            }
          }
        }
      }
    }

    expect(getProjectCollectionsRequiringChunking(state)).toEqual({
      collectionId: {
        granules: {
          hits: 2001
        }
      }
    })
  })

  test('returns an empty object when the granule count is less than the chunk limit', () => {
    const state = {
      project: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                hits: 500
              }
            }
          }
        }
      }
    }

    expect(getProjectCollectionsRequiringChunking(state)).toEqual({})
  })

  test('returns an empty object when there are no project collections', () => {
    const state = {
      project: {}
    }

    expect(getProjectCollectionsRequiringChunking(state)).toEqual({})
  })
})
