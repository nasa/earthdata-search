import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EditSubscriptionModal from '../EditSubscriptionModal'

const setup = setupTest({
  Component: EditSubscriptionModal,
  defaultProps: {
    isOpen: true,
    onToggleEditSubscriptionModal: jest.fn(),
    onUpdateSubscription: jest.fn(),
    subscriptions: {},
    subscriptionConceptId: '',
    subscriptionType: 'collection'
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: {
          subscriptions: {
            items: []
          }
        }
      }
    }
  }
})

describe('EditSubscriptionModal component', () => {
  test('should render a Modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup()

    expect(screen.getByText('Edit Subscription')).toBeInTheDocument()
  })

  describe('when a collection subscription is defined', () => {
    test('sets the value of the name input', () => {
      setup({
        overrideProps: {
          subscriptions: {
            byId: {
              SUB1: {
                name: 'Original Name'
              }
            }
          },
          subscriptionConceptId: 'SUB1'
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Original Name')
    })

    test('defaults the checkbox to unchecked', () => {
      setup({
        overrideProps: {
          subscriptions: {
            byId: {
              SUB1: {
                name: 'Original Name'
              }
            }
          },
          subscriptionConceptId: 'SUB1'
        }
      })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('when a granule subscription is defined', () => {
    test('sets the value of the name input', () => {
      setup({
        overrideProps: {
          subscriptionConceptId: 'SUB1',
          subscriptionType: 'granule'
        },
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
                subscriptions: {
                  items: [{
                    conceptId: 'SUB1',
                    name: 'Original Name (Granule)'
                  }]
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Original Name (Granule)')
    })

    test('defaults the checkbox to unchecked', () => {
      setup({
        overrideProps: {
          subscriptionConceptId: 'SUB1',
          subscriptionType: 'granule'
        },
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
                subscriptions: {
                  items: [{
                    conceptId: 'SUB1',
                    name: 'Original Name (Granule)'
                  }]
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('onSubscriptionEditSubmit', () => {
    test('calls onUpdateSubscription and onToggleEditSubscriptionModal', async () => {
      const { props, user } = setup({
        overrideProps: {
          subscriptions: {
            byId: {
              SUB1: {
                conceptId: 'SUB1',
                name: 'Original Name',
                nativeId: 'mock-guid'
              }
            }
          },
          subscriptionConceptId: 'SUB1'
        }
      })

      const submitButton = screen.getByRole('button', { name: 'Save' })
      await user.click(submitButton)

      expect(props.onUpdateSubscription).toHaveBeenCalledTimes(1)
      expect(props.onUpdateSubscription).toHaveBeenCalledWith({
        shouldUpdateQuery: false,
        subscription: {
          conceptId: 'SUB1',
          name: 'Original Name',
          nativeId: 'mock-guid'
        }
      })

      expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledWith({
        isOpen: false,
        subscriptionConceptId: '',
        type: ''
      })
    })
  })
})
