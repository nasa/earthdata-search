import {
  getSubscriptions,
  getSubscriptionsByCollectionId
} from '../subscriptions'

describe('getSubscriptions selector', () => {
  test('returns the subscriptions', () => {
    const state = {
      subscriptions: {
        byId: {
          'SUB100000-EDSC': {
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
          }
        },
        isLoading: false,
        isLoaded: true,
        error: null,
        timerStart: null,
        loadTime: 1265
      }
    }

    expect(getSubscriptions(state)).toEqual({
      byId: {
        'SUB100000-EDSC': {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Mattis Justo Vulputate Ullamcorper Amet.'
          },
          collectionConceptId: 'C100000-EDSC',
          conceptId: 'SUB100000-EDSC',
          name: 'Test Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
        }
      },
      isLoading: false,
      isLoaded: true,
      error: null,
      timerStart: null,
      loadTime: 1265
    })
  })

  test('returns an empty object when there are no subscriptions', () => {
    const state = {}

    expect(getSubscriptions(state)).toEqual({})
  })
})

describe('getSubscriptionsByCollectionId', () => {
  test('returns the subscriptions', () => {
    const state = {
      subscriptions: {
        byId: {
          'SUB100000-EDSC': {
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
          }
        },
        isLoading: false,
        isLoaded: true,
        error: null,
        timerStart: null,
        loadTime: 1265
      }
    }

    expect(getSubscriptionsByCollectionId(state)).toEqual({
      'C100000-EDSC': [{
        collection: {
          conceptId: 'C100000-EDSC',
          title: 'Mattis Justo Vulputate Ullamcorper Amet.'
        },
        collectionConceptId: 'C100000-EDSC',
        conceptId: 'SUB100000-EDSC',
        name: 'Test Subscription',
        query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
      }]
    })
  })
})
