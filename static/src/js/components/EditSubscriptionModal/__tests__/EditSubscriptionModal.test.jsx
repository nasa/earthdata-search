import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EditSubscriptionModal from '../EditSubscriptionModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: EditSubscriptionModal,
  defaultProps: {
    onUpdateSubscription: jest.fn(),
    subscriptions: {}
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
    },
    ui: {
      modals: {
        openModal: MODAL_NAMES.EDIT_SUBSCRIPTION,
        modalData: {
          subscriptionConceptId: '',
          subscriptionType: 'collection'
        },
        setOpenModal: jest.fn()
      }
    }
  }
})

describe('EditSubscriptionModal component', () => {
  test('does not render when modal is closed', () => {
    setup({
      overrideZustandState: {
        ui: {
          modals: {
            openModal: null
          }
        }
      }
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

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
          }
        },
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscriptionConceptId: 'SUB1',
                subscriptionType: 'collection'
              }
            }
          }
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
          overrideZustandState: {
            ui: {
              modals: {
                modalData: {
                  subscriptionConceptId: 'SUB1',
                  subscriptionType: 'collection'
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('when a granule subscription is defined', () => {
    test('sets the value of the name input', () => {
      setup({
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
          },
          ui: {
            modals: {
              modalData: {
                subscriptionConceptId: 'SUB1',
                subscriptionType: 'granule'
              }
            }
          }
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Original Name (Granule)')
    })

    test('defaults the checkbox to unchecked', () => {
      setup({
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
          },
          ui: {
            modals: {
              modalData: {
                subscriptionConceptId: 'SUB1',
                subscriptionType: 'granule'
              }
            }
          }
        }
      })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('onSubscriptionEditSubmit', () => {
    test('calls onUpdateSubscription and setOpenModal', async () => {
      const { props, user, zustandState } = setup({
        overrideProps: {
          subscriptions: {
            byId: {
              SUB1: {
                conceptId: 'SUB1',
                name: 'Original Name',
                nativeId: 'mock-guid'
              }
            }
          }
        },
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscriptionConceptId: 'SUB1',
                subscriptionType: 'collection'
              }
            }
          }
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

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })
})
