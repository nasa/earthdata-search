import React from 'react'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../vitestConfigs/getByTextWithMarkup'

import ChunkedOrderModal from '../ChunkedOrderModal'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import { MODAL_NAMES } from '../../../constants/modalNames'

// In order to pass out of scope variables into `jest` they must be prefixed with `mock`
vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  default: vi.fn((props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <mock-PortalLinkContainer {...props} />
  ))
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '?p=C100005-EDSC!C100005-EDSC&pg[1][v]=t',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const mockCreateRetrieval = vi.fn()
vi.mock('../../../hooks/useCreateRetrieval', () => ({
  useCreateRetrieval: () => ({ createRetrieval: mockCreateRetrieval })
}))

const setup = setupTest({
  Component: ChunkedOrderModal,
  defaultZustandState: {
    collection: {
      collectionMetadata: {
        'C100005-EDSC': {
          title: 'collection title'
        }
      }
    },
    project: {
      collections: {
        allIds: ['C100005-EDSC'],
        byId: {
          'C100005-EDSC': {
            granules: {
              count: 9001
            }
          }
        }
      }
    },
    ui: {
      modals: {
        openModal: MODAL_NAMES.CHUNKED_ORDER,
        setOpenModal: vi.fn()
      }
    }
  },
  withRouter: true
})

describe('ChunkedOrderModal component', () => {
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

  test('should render a title', () => {
    setup()

    expect(screen.getByText('Per-order Granule Limit Exceeded')).toBeInTheDocument()
  })

  test('should render instructions', () => {
    setup()

    expect(getByTextWithMarkup('The collection collection title contains 9,001 granules which exceeds the 2,000 granule limit configured by the provider. When submitted, the order will automatically be split into 5 orders.')).toBeInTheDocument()
  })

  test('should render instructions when the maxItemsPerOrder is less than 2000', () => {
    setup({
      overrideZustandState: {
        project: {
          collections: {
            allIds: ['C100005-EDSC'],
            byId: {
              'C100005-EDSC': {
                granules: {
                  count: 9001
                },
                accessMethods: {
                  echoOrder0: {
                    maxItemsPerOrder: 1000
                  }
                },
                selectedAccessMethod: 'echoOrder0'
              }
            }
          }
        }
      }
    })

    expect(getByTextWithMarkup('The collection collection title contains 9,001 granules which exceeds the 1,000 granule limit configured by the provider. When submitted, the order will automatically be split into 10 orders.')).toBeInTheDocument()
  })

  test('should render a \'Refine your search\' link that keeps the project params intact and removes the focused collection', async () => {
    const { user } = setup()

    await user.click(screen.getByText('Refine your search'))

    await waitFor(() => {
      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
    })

    expect(PortalLinkContainer).toHaveBeenCalledWith(expect.objectContaining({
      children: 'Refine your search',
      to: {
        pathname: '/search',
        search: '?p=!C100005-EDSC&pg[1][v]=t'
      },
      updatePath: true
    }), {})
  })

  describe('access methods email notice', () => {
    const emailNotice = 'Note: You will receive a separate set of confirmation emails for each order in collection title.'
    test('ordering shows the notice ', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['C100005-EDSC'],
              byId: {
                'C100005-EDSC': {
                  granules: {
                    count: 9001
                  },
                  selectedAccessMethod: 'echoOrder0'
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(emailNotice)).toBeInTheDocument()
    })

    test('esi shows the notice', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['C100005-EDSC'],
              byId: {
                'C100005-EDSC': {
                  granules: {
                    count: 9001
                  },
                  selectedAccessMethod: 'esi0'
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(emailNotice)).toBeInTheDocument()
    })

    test('harmony does no show the notice', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['C100005-EDSC'],
              byId: {
                'C100005-EDSC': {
                  granules: {
                    count: 9001
                  },
                  selectedAccessMethod: 'harmony0'
                }
              }
            }
          }
        }
      })

      expect(screen.queryByText(emailNotice)).not.toBeInTheDocument()
    })
  })

  describe('modal actions', () => {
    test('\'Refine your search\' button should trigger setOpenModal', async () => {
      const { user, zustandState } = setup()

      await user.click(screen.getByText('Refine your search'))

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)

      expect(mockCreateRetrieval).toHaveBeenCalledTimes(0)
    })

    test('\'Change access methods\' button should trigger setOpenModal', async () => {
      const { user, zustandState } = setup()

      await user.click(screen.getByRole('button', { name: 'Change access methods' }))

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)

      expect(mockCreateRetrieval).toHaveBeenCalledTimes(0)
    })

    test('\'Continue\' button should trigger setOpenModal', async () => {
      const { user, zustandState } = setup()

      await user.click(screen.getByRole('button', { name: 'Continue' }))

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)

      expect(mockCreateRetrieval).toHaveBeenCalledTimes(1)
      expect(mockCreateRetrieval).toHaveBeenCalledWith()
    })
  })
})
