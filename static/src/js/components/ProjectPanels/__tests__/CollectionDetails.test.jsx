import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as EventEmitter from '../../../events/events'
import CollectionDetails from '../CollectionDetails'

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
    location: {
      search: '?=test_search=test'
    },
    onFocusedGranuleChange: jest.fn(),
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
    project: {
      removeGranuleFromProjectCollection: jest.fn(),
      updateProjectGranuleParams: jest.fn()
    }
  },
  withRouter: true,
  withRedux: true
})

describe('CollectionDetails component', () => {
  test('renders the granules', () => {
    setup()

    expect(screen.getByText('GRAN-1.hdf', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('GRAN-2.hdf', { exact: true })).toBeInTheDocument()
  })

  describe('onMouseEnter', () => {
    test('focuses the granule', async () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

      const { user } = setup()

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      await user.hover(item)

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

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      await user.hover(item)

      jest.clearAllMocks()
      await user.unhover(item)

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

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      await user.click(item)

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

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      item.focus()
      await user.keyboard('{enter}')

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'map.layer.COLL-1.focusGranule',
        {
          granule: granules[0]
        }
      )
    })
  })

  describe('Remove granule button', () => {
    test('removes the granule', async () => {
      const { props, user, zustandState } = setup()

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      const removeButton = within(item).getByRole('button', { name: 'Remove granule' })

      await user.click(removeButton)

      expect(zustandState.project.removeGranuleFromProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.removeGranuleFromProjectCollection).toHaveBeenCalledWith({
        collectionId: props.collectionId,
        granuleId: 'GRAN-1-PROV'
      })
    })
  })

  describe('View granule details button', () => {
    test('focuses the granule', async () => {
      const { props, user } = setup()

      const item = screen.getByRole('button', { name: 'GRAN-1.hdf' })
      const infoButton = within(item).getByRole('button', { name: 'View granule details' })

      await user.click(infoButton)

      expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('GRAN-1-PROV')
    })
  })

  describe('when added granules are provided', () => {
    test('renders the added granules', () => {
      setup({
        overrideProps: {
          projectCollection: {
            granules: {
              allIds: ['GRAN-1-PROV'],
              hits: 1,
              addedGranuleIds: ['GRAN-1-PROV']
            }
          }
        }
      })

      expect(screen.getByText('GRAN-1.hdf', { exact: true })).toBeInTheDocument()
    })
  })

  describe('when removed granules are provided', () => {
    test('renders the removed granules', () => {
      setup({
        overrideProps: {
          projectCollection: {
            granules: {
              allIds: ['GRAN-2-PROV'],
              hits: 1,
              removedGranuleIds: ['GRAN-1-PROV']
            }
          }
        }
      })

      expect(screen.queryByText('GRAN-1.hdf', { exact: true })).not.toBeInTheDocument()
      expect(screen.getByText('GRAN-2.hdf', { exact: true })).toBeInTheDocument()
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
      const { user, zustandState } = setup({
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

      expect(zustandState.project.updateProjectGranuleParams).toHaveBeenCalledTimes(1)
      expect(zustandState.project.updateProjectGranuleParams).toHaveBeenCalledWith({
        collectionId: 'COLL-1',
        pageNum: 2
      })
    })
  })
})
