import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CollectionDetails from '../CollectionDetails'

import useEdscStore from '../../../zustand/useEdscStore'

import * as EventEmitter from '../../../events/events'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

const granules = [
  {
    conceptId: 'GRAN-1-PROV',
    collectionConceptId: 'COLL-1',
    title: 'GRAN-1.hdf'
  },
  {
    conceptId: 'GRAN-2-PROV',
    collectionConceptId: 'COLL-1',
    title: 'GRAN-2.hdf'
  }
]

const setup = setupTest({
  Component: CollectionDetails,
  defaultProps: {
    collectionId: 'COLL-1',
    focusedGranuleId: '',
    granulesMetadata: {
      'GRAN-1-PROV': granules[0],
      'GRAN-2-PROV': granules[1]
    },
    onChangeProjectGranulePageNum: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    portal: {
      portalId: 'edsc'
    },
    projectCollection: {
      granules: {
        allIds: ['GRAN-1-PROV', 'GRAN-2-PROV'],
        hits: 2,
        params: {
          pageNum: 1
        }
      }
    }
  },
  defaultZustandState: {
    location: {
      location: {
        search: '?test_search=test'
      },
      navigate: jest.fn()
    }
  },
  withRedux: true,
  defaultReduxState: {
    portal: {
      portalId: 'edsc'
    }
  },
  withRouter: true
})

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('CollectionDetails component', () => {
  describe('when there are no granules', () => {
    test('does not render any list items', () => {
      setup({
        overrideProps: {
          projectCollection: {
            granules: {
              allIds: [],
              hits: 0
            }
          }
        }
      })

      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })

  describe('when there are granules', () => {
    test('renders the granules', () => {
      setup()

      expect(screen.getAllByRole('listitem').length).toEqual(2)
    })

    describe('onMouseEnter', () => {
      test('focuses the granule', async () => {
        const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'GRAN-1.hdf' })
        await user.hover(button)

        expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
        expect(eventEmitterEmitMock).toHaveBeenCalledWith(
          'map.layer.COLL-1.hoverGranule',
          {
            granule: granules[0]
          }
        )
      })
    })

    describe('onMouseLeave', () => {
      test('unfocuses the granule', async () => {
        const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'GRAN-1.hdf' })
        await user.hover(button)

        expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
        expect(eventEmitterEmitMock).toHaveBeenCalledWith(
          'map.layer.COLL-1.hoverGranule',
          {
            granule: granules[0]
          }
        )

        jest.clearAllMocks()
        await user.unhover(button)

        expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
        expect(eventEmitterEmitMock).toHaveBeenCalledWith(
          'map.layer.COLL-1.hoverGranule',
          {
            granule: null
          }
        )
      })
    })

    describe('onClick', () => {
      test('focuses the granule', async () => {
        const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'GRAN-1.hdf' })
        await user.click(button)

        expect(eventEmitterEmitMock).toHaveBeenCalledTimes(2)
        expect(eventEmitterEmitMock).toHaveBeenNthCalledWith(
          1,
          'map.layer.COLL-1.hoverGranule',
          {
            granule: granules[0]
          }
        )

        expect(eventEmitterEmitMock).toHaveBeenNthCalledWith(
          2,
          'map.layer.COLL-1.focusGranule',
          {
            granule: granules[0]
          }
        )
      })
    })

    describe('onKeyDown', () => {
      test('focuses the granule', async () => {
        const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'GRAN-1.hdf' })
        await user.type(button, '{Enter}')

        expect(eventEmitterEmitMock).toHaveBeenCalledTimes(3)
        expect(eventEmitterEmitMock).toHaveBeenNthCalledWith(
          1,
          'map.layer.COLL-1.hoverGranule',
          {
            granule: granules[0]
          }
        )

        // The click to focus
        expect(eventEmitterEmitMock).toHaveBeenNthCalledWith(
          2,
          'map.layer.COLL-1.focusGranule',
          {
            granule: granules[0]
          }
        )

        // The keydown
        expect(eventEmitterEmitMock).toHaveBeenNthCalledWith(
          3,
          'map.layer.COLL-1.focusGranule',
          {
            granule: granules[0]
          }
        )
      })
    })

    describe('Remove granule button', () => {
      test('removes the granule', async () => {
        const { props, user } = setup()

        const [button] = screen.getAllByRole('button', { name: 'Remove granule' })
        await user.click(button)

        expect(props.onRemoveGranuleFromProjectCollection).toHaveBeenCalledTimes(1)
        expect(props.onRemoveGranuleFromProjectCollection).toHaveBeenCalledWith({
          collectionId: props.collectionId,
          granuleId: 'GRAN-1-PROV'
        })
      })
    })

    describe('View granule details button', () => {
      test('focuses the granule', async () => {
        const { props, user } = setup()

        const [button] = screen.getAllByRole('button', { name: 'View granule details' })
        await user.click(button)

        expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('GRAN-1-PROV')
      })

      test('sets the location', async () => {
        jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'test',
          defaultPortal: 'edsc'
        }))

        const { user } = setup()

        const [button] = screen.getAllByRole('button', { name: 'View granule details' })
        await user.click(button)

        const zustandState = useEdscStore.getState()
        const { location } = zustandState
        const { navigate } = location

        await waitFor(() => {
          expect(navigate).toHaveBeenCalledTimes(1)
        })

        expect(navigate).toHaveBeenCalledWith({
          pathname: '/search/granules/granule-details',
          search: '?test_search=test'
        })
      })
    })

    describe('when added granules are provided', () => {
      test('renders the added granules', () => {
        setup({
          overrideProps: {
            projectCollection: {
              granules: {
                allIds: ['GRAN-1-PROV', 'GRAN-2-PROV'],
                hits: 1,
                addedGranuleIds: ['GRAN-1-PROV']
              }
            }
          }
        })

        expect(screen.getAllByRole('listitem').length).toEqual(1)
        expect(screen.getByText('GRAN-1.hdf')).toBeInTheDocument()
        expect(screen.queryByText('GRAN-2.hdf')).not.toBeInTheDocument()
      })
    })

    describe('when removed granules are provided', () => {
      test('renders the removed granules', () => {
        setup({
          overrideProps: {
            projectCollection: {
              granules: {
                allIds: ['GRAN-1-PROV', 'GRAN-2-PROV'],
                hits: 1,
                removedGranuleIds: ['GRAN-1-PROV']
              }
            }
          }
        })

        expect(screen.getAllByRole('listitem').length).toEqual(1)
        expect(screen.queryByText('GRAN-1.hdf')).not.toBeInTheDocument()
        expect(screen.getByText('GRAN-2.hdf')).toBeInTheDocument()
      })
    })

    describe('when all granules have not loaded', () => {
      test('renders the load more granules button', () => {
        setup({
          overrideProps: {
            granulesMetadata: {
              'GRAN-1-PROV': granules[0]
            },
            projectCollection: {
              granules: {
                allIds: ['GRAN-1-PROV'],
                hits: 2,
                params: {
                  pageNum: 1
                }
              }
            }
          }
        })

        expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
      })
    })

    describe('Load more granules button', () => {
      test('renders the load more granules button', async () => {
        const { props, user } = setup({
          overrideProps: {
            granulesMetadata: {
              'GRAN-1-PROV': granules[0]
            },
            projectCollection: {
              granules: {
                allIds: ['GRAN-1-PROV'],
                hits: 2,
                params: {
                  pageNum: 1
                }
              }
            }
          }
        })

        const button = screen.getByRole('button', { name: 'Load more' })
        await user.click(button)

        expect(props.onChangeProjectGranulePageNum).toHaveBeenCalledTimes(1)
        expect(props.onChangeProjectGranulePageNum).toHaveBeenCalledWith({
          collectionId: 'COLL-1',
          pageNum: 2
        })
      })
    })
  })
})
