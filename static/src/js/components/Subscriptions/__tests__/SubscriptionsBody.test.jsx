import { screen, waitFor } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../vitestConfigs/getByTextWithMarkup'

import SubscriptionsBody from '../SubscriptionsBody'
import SubscriptionsListItem from '../SubscriptionsListItem'
import SUBSCRIPTIONS from '../../../operations/queries/subscriptions'
import addToast from '../../../util/addToast'
import CREATE_SUBSCRIPTION from '../../../operations/mutations/createSubscription'

vi.mock('../../../util/addToast', () => ({ default: vi.fn() }))

vi.mock('../SubscriptionsListItem', () => ({
  default: vi.fn(() => null)
}))

const setup = setupTest({
  Component: SubscriptionsBody,
  defaultProps: {
    setSubscriptionCount: vi.fn(),
    subscriptionType: 'collection'
  },
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
    },
    user: {
      username: 'testuser'
    }
  },
  defaultApolloClientMocks: [{
    request: {
      query: SUBSCRIPTIONS,
      variables: {
        params: {
          subscriberId: 'testuser',
          type: 'collection'
        }
      }
    },
    result: {
      data: {
        subscriptions: {
          items: []
        }
      }
    }
  }],
  withApolloClient: true,
  withRouter: true
})

describe('SubscriptionsBody component', () => {
  test('should render intro text', () => {
    setup()

    expect(screen.getByText('Subscribe to be notified by email when new data matching your search query becomes available.')).toBeInTheDocument()
  })

  describe('when creating a subscription', () => {
    test('calls addToast', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              hasGranulesOrCwic: true,
              spatial: {
                point: ['39.76036, -78.7812']
              }
            }
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: []
              }
            }
          }
        }, {
          request: {
            query: CREATE_SUBSCRIPTION,
            variables: {
              params: {
                subscriberId: 'testuser',
                name: 'Dataset Search Subscription (Point)',
                type: 'collection',
                query: 'has_granules_or_cwic=true&point[]=39.76036, -78.7812'
              }
            }
          },
          result: {
            data: {
              createSubscription: {
                conceptId: 'SUB-12345'
              }
            }
          }
        }, {
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: [{
                  collection: {
                    conceptId: 'C123-PROV',
                    title: 'Test Collection'
                  },
                  collectionConceptId: 'C123-PROV',
                  conceptId: 'SUB-12345',
                  creationDate: '2024-01-01T12:00:00Z',
                  name: 'Dataset Search Subscription (Point)',
                  nativeId: 'native-id-12345',
                  query: 'has_granules_or_cwic=true&point[]=39.76036, -78.7812',
                  revisionDate: '2024-01-01T12:00:00Z',
                  type: 'collection'
                }]
              }
            }
          }
        }]
      })

      const button = screen.getByRole('button', { name: 'Create Subscription' })
      await user.click(button)

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription created', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    describe('when the subscription creation fails', () => {
      test('calls handleError with the error message', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  type: 'collection'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: []
                }
              }
            }
          }, {
            request: {
              query: CREATE_SUBSCRIPTION,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  name: 'Dataset Search Subscription (0 filters)',
                  type: 'collection',
                  query: 'has_granules_or_cwic=true'
                }
              }
            },
            error: new ApolloError({ errorMessage: 'Failed to create subscription' })
          }]
        })

        const button = screen.getByRole('button', { name: 'Create Subscription' })
        await user.click(button)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'createSubscription',
          error: new ApolloError({ errorMessage: 'Failed to create subscription' }),
          notificationType: 'toast',
          resource: 'subscription',
          showAlertButton: true,
          title: 'Something went wrong creating your subscription'
        })
      })
    })

    describe('when creating a collection with the No Subscriptions Exist button', () => {
      test('calls addToast', async () => {
        const { user } = setup({
          overrideZustandState: {
            query: {
              collection: {
                hasGranulesOrCwic: true,
                spatial: {
                  point: ['39.76036, -78.7812']
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  type: 'collection'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: []
                }
              }
            }
          }, {
            request: {
              query: CREATE_SUBSCRIPTION,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  name: 'Dataset Search Subscription (Point)',
                  type: 'collection',
                  query: 'has_granules_or_cwic=true&point[]=39.76036, -78.7812'
                }
              }
            },
            result: {
              data: {
                createSubscription: {
                  conceptId: 'SUB-12345'
                }
              }
            }
          }, {
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  type: 'collection'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: [{
                    collection: {
                      conceptId: 'C123-PROV',
                      title: 'Test Collection'
                    },
                    collectionConceptId: 'C123-PROV',
                    conceptId: 'SUB-12345',
                    creationDate: '2024-01-01T12:00:00Z',
                    name: 'Dataset Search Subscription (Point)',
                    nativeId: 'native-id-12345',
                    query: 'has_granules_or_cwic=true&point[]=39.76036, -78.7812',
                    revisionDate: '2024-01-01T12:00:00Z',
                    type: 'collection'
                  }]
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create New Subscription' })
        await user.click(button)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Subscription created', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })

    describe('when creating a collection with a custom name', () => {
      test('calls addToast', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  type: 'collection'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: []
                }
              }
            }
          }, {
            request: {
              query: CREATE_SUBSCRIPTION,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  name: 'Test Name',
                  type: 'collection',
                  query: 'has_granules_or_cwic=true'
                }
              }
            },
            result: {
              data: {
                createSubscription: {
                  conceptId: 'SUB-12345'
                }
              }
            }
          }, {
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  type: 'collection'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: [{
                    collection: {
                      conceptId: 'C123-PROV',
                      title: 'Test Collection'
                    },
                    collectionConceptId: 'C123-PROV',
                    conceptId: 'SUB-12345',
                    creationDate: '2024-01-01T12:00:00Z',
                    name: 'Test Name',
                    nativeId: 'native-id-12345',
                    query: 'has_granules_or_cwic=true',
                    revisionDate: '2024-01-01T12:00:00Z',
                    type: 'collection'
                  }]
                }
              }
            }
          }]
        })

        const input = screen.getByRole('textbox')
        await user.type(input, 'Test Name')

        const button = screen.getByRole('button', { name: 'Create Subscription' })
        await user.click(button)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Subscription created', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })

    describe('when creating a granule subscription', () => {
      test('calls addToast', async () => {
        const { user } = setup({
          overrideProps: {
            subscriptionType: 'granule'
          },
          overrideZustandState: {
            collection: {
              collectionId: 'C123-PROV'
            },
            query: {
              collection: {
                spatial: {
                  point: ['39.76036,-78.7812']
                },
                hasGranulesOrCwic: true
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  collectionConceptId: 'C123-PROV',
                  subscriberId: 'testuser',
                  type: 'granule'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: []
                }
              }
            }
          }, {
            request: {
              query: CREATE_SUBSCRIPTION,
              variables: {
                params: {
                  subscriberId: 'testuser',
                  name: 'Granule Search Subscription (Point)',
                  type: 'granule',
                  query: 'point[]=39.76036,-78.7812',
                  collectionConceptId: 'C123-PROV'
                }
              }
            },
            result: {
              data: {
                createSubscription: {
                  conceptId: 'SUB-67890'
                }
              }
            }
          }, {
            request: {
              query: SUBSCRIPTIONS,
              variables: {
                params: {
                  collectionConceptId: 'C123-PROV',
                  subscriberId: 'testuser',
                  type: 'granule'
                }
              }
            },
            result: {
              data: {
                subscriptions: {
                  items: [{
                    collection: {
                      conceptId: 'C123-PROV',
                      title: 'Test Collection'
                    },
                    collectionConceptId: 'C123-PROV',
                    conceptId: 'SUB-67890',
                    creationDate: '2024-01-01T12:00:00Z',
                    name: 'Dataset Search Subscription (0 filters)',
                    nativeId: 'native-id-67890',
                    query: 'has_granules_or_cwic=true',
                    revisionDate: '2024-01-01T12:00:00Z',
                    type: 'granule'
                  }]
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create Subscription' })
        await user.click(button)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Subscription created', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })
  })

  describe('when subscriptions exist', () => {
    test('calls setSubscriptionCount with the number of subscriptions', async () => {
      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: [{
                  collection: null,
                  collectionConceptId: null,
                  conceptId: 'SUB-1',
                  creationDate: '2024-01-01T12:00:00Z',
                  name: 'Subscription 1',
                  nativeId: 'sub-1-native-id',
                  query: 'has_granules_or_cwic=true&keyword=one*',
                  revisionDate: '2024-01-01T12:00:00Z',
                  type: 'collection'
                }]
              }
            }
          }
        }]
      })

      await waitFor(() => {
        // 2 because once on initial render, and the second time after loading completes
        expect(props.setSubscriptionCount).toHaveBeenCalledTimes(2)
      })

      expect(props.setSubscriptionCount).toHaveBeenNthCalledWith(1, 0)
      expect(props.setSubscriptionCount).toHaveBeenNthCalledWith(2, 1)
    })
  })

  describe('when the current query already exists', () => {
    test('should show a message about the duplicate query and render SubscriptionsListItem', async () => {
      const subOne = {
        collection: null,
        collectionConceptId: null,
        conceptId: 'SUB-1',
        creationDate: '2024-01-01T12:00:00Z',
        name: 'Subscription 1',
        nativeId: 'sub-1-native-id',
        query: 'has_granules_or_cwic=true&keyword=one*',
        revisionDate: '2024-01-01T12:00:00Z',
        type: 'collection'
      }

      const subTwo = {
        collection: null,
        collectionConceptId: null,
        conceptId: 'SUB-2',
        creationDate: '2024-01-01T12:00:00Z',
        name: 'Subscription 2',
        nativeId: 'sub-2-native-id',
        query: 'has_granules_or_cwic=true&keyword=two*',
        revisionDate: '2024-01-01T12:00:00Z',
        type: 'collection'
      }

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: [
                  subOne,
                  subTwo
                ]
              }
            }
          }
        }],
        overrideZustandState: {
          query: {
            collection: {
              keyword: 'one',
              hasGranulesOrCwic: true
            }
          }
        }
      })

      // Wait for the subscriptions to load
      await waitFor(() => {
        expect(SubscriptionsListItem).toHaveBeenCalledTimes(2)
      })

      expect(SubscriptionsListItem).toHaveBeenNthCalledWith(1, {
        exactlyMatchingSubscriptions: [{
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB-1',
          creationDate: '2024-01-01T12:00:00Z',
          name: 'Subscription 1',
          nativeId: 'sub-1-native-id',
          query: 'has_granules_or_cwic=true&keyword=one*',
          revisionDate: '2024-01-01T12:00:00Z',
          type: 'collection'
        }],
        hasNullCmrQuery: false,
        newQuery: 'has_granules_or_cwic=true&keyword=one*',
        subscription: {
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB-1',
          creationDate: '2024-01-01T12:00:00Z',
          name: 'Subscription 1',
          nativeId: 'sub-1-native-id',
          query: 'has_granules_or_cwic=true&keyword=one*',
          revisionDate: '2024-01-01T12:00:00Z',
          type: 'collection'
        },
        subscriptionType: 'collection'
      }, {})

      expect(SubscriptionsListItem).toHaveBeenNthCalledWith(2, {
        exactlyMatchingSubscriptions: [{
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB-1',
          creationDate: '2024-01-01T12:00:00Z',
          name: 'Subscription 1',
          nativeId: 'sub-1-native-id',
          query: 'has_granules_or_cwic=true&keyword=one*',
          revisionDate: '2024-01-01T12:00:00Z',
          type: 'collection'
        }],
        hasNullCmrQuery: false,
        newQuery: 'has_granules_or_cwic=true&keyword=one*',
        subscription: {
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB-2',
          creationDate: '2024-01-01T12:00:00Z',
          name: 'Subscription 2',
          nativeId: 'sub-2-native-id',
          query: 'has_granules_or_cwic=true&keyword=two*',
          revisionDate: '2024-01-01T12:00:00Z',
          type: 'collection'
        },
        subscriptionType: 'collection'
      }, {})

      const element = getByTextWithMarkup('The subscription Subscription 1 matches the current search query. Choose a different search query to create a new subscription.')
      expect(element).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Create Subscription' })).toBeDisabled()
    })
  })

  describe('when the query is not supported', () => {
    test('should show a message about the unsupported query and render SubscriptionsListItem', async () => {
      setup({
        overrideApolloClientMocks: [{
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: []
              }
            }
          }
        }],
        overrideZustandState: {
          query: {
            collection: {
              hasGranulesOrCwic: null
            }
          }
        }
      })

      expect(screen.getByText('The current query is not currently supported. Add additional filters to create a new subscription.')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Create Subscription' })).toBeDisabled()
    })
  })

  describe('when the name is too long', () => {
    test('should show a warning about the name length', async () => {
      const { user } = setup()

      const input = screen.getByRole('textbox')
      await user.type(input, 'This is a very long subscription name that is definitely going to be more than eighty characters long which is the limit.')

      expect(screen.getByText('The subscription name must be less than 80 characters long.')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Create Subscription' })).toBeDisabled()
    })
  })

  describe('when the subscriptionType is granule and no collection is selected', () => {
    test('does not call useQuery', () => {
      setup({
        overrideProps: {
          subscriptionType: 'granule'
        },
        overrideZustandState: {
          collection: {
            collectionId: null
          }
        },
        overrideApolloClientMocks: []
      })

      expect(screen.getByText('The current query is not currently supported. Add additional filters to create a new subscription.')).toBeInTheDocument()
    })
  })
})
