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
          newQuery: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
          subscription: {
            collection: null,
            collectionConceptId: null,
            conceptId: 'SUB12345-EDSC',
            creationDate: '2026-01-01T01:56:16.184Z',
            name: 'Test Subscription',
            nativeId: 'native-id',
            query: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
            revisionDate: '2026-01-01T02:06:25.385Z',
            type: 'collection'
          }
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
      setup()

      expect(screen.getByRole('textbox')).toHaveValue('Test Subscription')
    })

    test('defaults the checkbox to unchecked', () => {
      setup()

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
                newQuery: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
                subscription: {
                  collection: {
                    conceptId: 'C12345-EDSC',
                    title: 'Test Collection'
                  },
                  collectionConceptId: 'C12345-EDSC',
                  conceptId: 'SUB12345-EDSC',
                  creationDate: '2026-01-01T01:56:16.184Z',
                  name: 'Test Granule Subscription',
                  nativeId: 'native-id',
                  query: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
                  revisionDate: '2026-01-01T02:06:25.385Z',
                  type: 'collection'
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Test Granule Subscription')
    })

    test('defaults the checkbox to unchecked', () => {
      setup({
        overrideZustandState: {
          ui: {
            modals: {
              modalData: {
                newQuery: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
                subscription: {
                  collection: {
                    conceptId: 'C12345-EDSC',
                    title: 'Test Collection'
                  },
                  collectionConceptId: 'C12345-EDSC',
                  conceptId: 'SUB12345-EDSC',
                  creationDate: '2026-01-01T01:56:16.184Z',
                  name: 'Test Granule Subscription',
                  nativeId: 'native-id',
                  query: 'has_granules_or_cwic=true&point[]=-75.99033,38.63975',
                  revisionDate: '2026-01-01T02:06:25.385Z',
                  type: 'collection'
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
    describe('when submitting a collection subscription', () => {
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
    })

    describe('when submitting a granule subscription', () => {
      test('calls addToast and setOpenModal', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            ui: {
              modals: {
                modalData: {
                  subscription: {
                    collectionConceptId: 'C12345-EDSC',
                    name: 'Original Name',
                    nativeId: 'mock-guid',
                    query: 'mock=query',
                    subscriberId: 'subscriber-id',
                    type: 'granule'
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
                  collectionConceptId: 'C12345-EDSC',
                  name: 'Original Name',
                  nativeId: 'mock-guid',
                  query: 'mock=query',
                  subscriberId: 'subscriber-id',
                  type: 'granule'
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
    })

    describe('when updating the subscription query', () => {
      test('calls addToast and setOpenModal', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            ui: {
              modals: {
                modalData: {
                  newQuery: 'updated=query',
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
                  query: 'updated=query',
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

        const updateQueryCheckbox = screen.getByRole('checkbox')
        await user.click(updateQueryCheckbox)

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
