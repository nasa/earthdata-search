import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as EventEmitter from '../../../events/events'
import CollectionDetails from '../CollectionDetails'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

const granules = [
  {
    concept_id: 'GRAN-1-PROV',
    collection_concept_id: 'COLL-1',
    producer_granule_id: 'GRAN-1.hdf'
  },
  {
    concept_id: 'GRAN-2-PROV',
    collection_concept_id: 'COLL-1',
    producer_granule_id: 'GRAN-2.hdf'
  }
]

function setup(overrideProps) {
  const props = {
    granules: {
      hits: 2,
      allIds: ['GRAN-1-PROV', 'GRAN-2-PROV'],
      byId: {
        'GRAN-1-PROV': granules[0],
        'GRAN-2-PROV': granules[1]
      }
    },
    collection: {
      granules: {
        hits: 2,
        allIds: ['GRAN-1-PROV', 'GRAN-2-PROV'],
        byId: {
          'GRAN-1-PROV': granules[0],
          'GRAN-2-PROV': granules[1]
        }
      }
    },
    collectionId: 'COLL-1',
    granuleQuery: {
      pageNum: 1
    },
    focusedGranule: '',
    location: {
      search: '?=test_search=test'
    },
    portal: {
      portalId: 'edsc'
    },
    projectCollection: {},
    onChangeGranulePageNum: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    ...overrideProps
  }

  return {
    enzymeWrapper: shallow(
      <CollectionDetails {...props} />
    ),
    props
  }
}

describe('CollectionDetails component', () => {
  const { enzymeWrapper } = setup()

  test('renders a div', () => {
    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.props().className).toEqual('collection-details')
  })

  test('renders the granules', () => {
    expect(enzymeWrapper.find('.collection-details__item').length).toEqual(2)
  })

  test('renders the granule count', () => {
    expect(enzymeWrapper.find('.collection-details__meta').text())
      .toEqual('Showing 2 of 2 granules in project')
  })

  describe('onMouseEnter', () => {
    test('focuses the granule', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)

      item.simulate('mouseenter')
      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'map.layer.COLL-1.focusgranule',
        {
          granule: granules[0]
        }
      )
    })
  })

  describe('onMouseLeave', () => {
    test('unfocuses the granule', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)

      item.simulate('mouseleave')
      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'map.layer.COLL-1.focusgranule',
        {
          granule: null
        }
      )
    })
  })

  describe('onClick', () => {
    test('focuses the granule', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)

      item.simulate('click')
      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'map.layer.COLL-1.stickygranule',
        {
          granule: granules[0]
        }
      )
    })
  })

  describe('onKeyPress', () => {
    test('focuses the granule', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)

      item.simulate('keypress')
      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'map.layer.COLL-1.stickygranule',
        {
          granule: granules[0]
        }
      )
    })
  })

  describe('Remove granule button', () => {
    test('removes the granule', () => {
      const { enzymeWrapper, props } = setup()

      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)
      const removeButton = item.find('.collection-details__item-action').at(1)

      removeButton.props().onClick({
        stopPropagation: jest.fn()
      })

      expect(props.onRemoveGranuleFromProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onRemoveGranuleFromProjectCollection).toHaveBeenCalledWith({
        collectionId: props.collectionId,
        granuleId: 'GRAN-1-PROV'
      })
    })
  })

  describe('View granule details button', () => {
    test('focuses the granule', () => {
      const { enzymeWrapper, props } = setup()

      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)
      const infoButton = item.find('.collection-details__item-action').at(0)

      infoButton.props().onClick({
        stopPropagation: jest.fn()
      })

      expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('GRAN-1-PROV')
    })

    test('sets the location', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc'
      }))
      const { enzymeWrapper } = setup()

      const item = enzymeWrapper.find('.collection-details__item-wrapper').at(0)
      const infoButton = item.find('.collection-details__item-action').at(0)

      expect(infoButton.props().to).toEqual({
        pathname: '/search/granules/granule-details',
        search: '?=test_search=test'
      })
    })
  })

  describe('when added granules are provided', () => {
    const { enzymeWrapper } = setup({
      projectCollection: {
        addedGranuleIds: ['GRAN-1-PROV']
      }
    })

    test('renders the added granules', () => {
      expect(enzymeWrapper.find('.collection-details__item').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-details__item').text()).toContain('GRAN-1.hdf')
    })

    test('renders the granule count', () => {
      expect(enzymeWrapper.find('.collection-details__meta').text())
        .toEqual('Showing 1 of 1 granules in project')
    })
  })

  describe('when removed granules are provided', () => {
    const { enzymeWrapper } = setup({
      projectCollection: {
        removedGranuleIds: ['GRAN-1-PROV']
      }
    })

    test('renders the removed granules', () => {
      expect(enzymeWrapper.find('.collection-details__item').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-details__item').text()).toContain('GRAN-2.hdf')
    })

    test('renders the granule count', () => {
      expect(enzymeWrapper.find('.collection-details__meta').text())
        .toEqual('Showing 1 of 1 granules in project')
    })
  })

  describe('when all granules have not loaded', () => {
    const { enzymeWrapper } = setup({
      granules: {
        hits: 2,
        allIds: ['GRAN-1-PROV'],
        byId: {
          'GRAN-1-PROV': granules[0]
        }
      },
      collection: {
        granules: {
          hits: 2,
          allIds: ['GRAN-1-PROV'],
          byId: {
            'GRAN-1-PROV': granules[0]
          }
        }
      }
    })

    test('renders the load more granules button', () => {
      expect(enzymeWrapper.find('.collection-details__more-granules-button').length).toEqual(1)
    })
  })

  describe('Load more granules button', () => {
    test('renders the load more granules button', () => {
      const { enzymeWrapper, props } = setup({
        granules: {
          hits: 2,
          allIds: ['GRAN-1-PROV'],
          byId: {
            'GRAN-1-PROV': granules[0]
          }
        },
        collection: {
          granules: {
            hits: 2,
            allIds: ['GRAN-1-PROV'],
            byId: {
              'GRAN-1-PROV': granules[0]
            }
          }
        }
      })

      const button = enzymeWrapper.find('.collection-details__more-granules-button')
      button.props().onClick()

      expect(props.onChangeGranulePageNum).toHaveBeenCalledTimes(1)
      expect(props.onChangeGranulePageNum).toHaveBeenCalledWith({ collectionId: 'COLL-1', pageNum: 2 })
    })
  })
})
