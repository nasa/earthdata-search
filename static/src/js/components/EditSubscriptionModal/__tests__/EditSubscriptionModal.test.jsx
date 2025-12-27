import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EditSubscriptionModal from '../EditSubscriptionModal'
import { MODAL_NAMES } from '../../../constants/modalNames'
import UPDATE_SUBSCRIPTION from '../../../operations/mutations/updateSubscription'
import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast', () => jest.fn())

const setup = setupTest({
  Component: EditSubscriptionModal,
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
  },
  withApolloClient: true
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
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name'
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Original Name')
    })

    test('defaults the checkbox to unchecked', () => {
      setup({
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name'
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
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name (Granule)'
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
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name (Granule)'
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('when changing the subscription name', () => {
    test('updates the name input value', async () => {
      const { user } = setup({
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name'
                }
              }
            }
          }
        }
      })

      const nameInput = screen.getByRole('textbox')
      expect(nameInput).toHaveValue('Original Name')

      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Name')

      expect(nameInput).toHaveValue('Updated Name')
    })
  })

  describe('when toggling the update query checkbox', () => {
    test('updates the checkbox value', async () => {
      const { user } = setup({
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name'
                }
              }
            }
          }
        }
      })

      const updateQueryCheckbox = screen.getByRole('checkbox')
      expect(updateQueryCheckbox).not.toBeChecked()

      await user.click(updateQueryCheckbox)

      expect(updateQueryCheckbox).toBeChecked()
    })
  })

  describe('when submitting the form', () => {
    test('calls addToast and setOpenModal', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                subscription: {
                  name: 'Original Name',
                  nativeId: 'mock-guid',
                  query: 'mock=query',
                  subscriberId: 'subscriber-id',
                  type: 'collection'
                }
              }
            }
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: UPDATE_SUBSCRIPTION,
            variables: {
              params: {
                collectionConceptId: undefined,
                name: 'Original Name',
                nativeId: 'mock-guid',
                query: 'mock=query',
                subscriberId: 'subscriber-id',
                type: 'collection'
              }
            }
          },
          result: {
            data: {
              updateSubscription: {
                conceptId: 'SUB1',
                name: 'Original Name',
                nativeId: 'mock-guid'
              }
            }
          }
        }]
      })

      const submitButton = screen.getByRole('button', { name: 'Save' })
      await user.click(submitButton)

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription updated', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })

    describe('when the mutation errors', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            errors: {
              handleError: jest.fn()
            },
            ui: {
              modals: {
                modalData: {
                  subscription: {
                    name: 'Original Name',
                    nativeId: 'mock-guid',
                    query: 'mock=query',
                    subscriberId: 'subscriber-id',
                    type: 'collection'
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: UPDATE_SUBSCRIPTION,
              variables: {
                params: {
                  collectionConceptId: undefined,
                  name: 'Original Name',
                  nativeId: 'mock-guid',
                  query: 'mock=query',
                  subscriberId: 'subscriber-id',
                  type: 'collection'
                }
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const submitButton = screen.getByRole('button', { name: 'Save' })
        await user.click(submitButton)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'updateSubscription',
          resource: 'subscription',
          verb: 'updating',
          showAlertButton: true,
          title: 'Something went wrong updating your subscription'
        })
      })
    })
  })
})
