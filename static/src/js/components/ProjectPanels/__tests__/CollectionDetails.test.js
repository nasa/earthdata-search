import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

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

function setup(overrideProps) {
  const props = {
    collectionId: 'COLL-1',
    focusedGranuleId: '',
    granulesMetadata: {
      'GRAN-1-PROV': granules[0],
      'GRAN-2-PROV': granules[1]
    },
    location: {
      search: '?=test_search=test'
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
    },
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
        granules: {
          allIds: ['GRAN-1-PROV'],
          hits: 1,
          addedGranuleIds: ['GRAN-1-PROV']
        }
      }
    })

    test('renders the added granules', () => {
      expect(enzymeWrapper.find('.collection-details__item').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-details__item').text()).toContain('GRAN-1.hdf')
    })
  })

  describe('when removed granules are provided', () => {
    const { enzymeWrapper } = setup({
      projectCollection: {
        granules: {
          allIds: ['GRAN-2-PROV'],
          hits: 1,
          removedGranuleIds: ['GRAN-1-PROV']
        }
      }
    })

    test('renders the removed granules', () => {
      expect(enzymeWrapper.find('.collection-details__item').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-details__item').text()).toContain('GRAN-2.hdf')
    })
  })

  describe('when all granules have not loaded', () => {
    const { enzymeWrapper } = setup({
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
    })

    test('renders the load more granules button', () => {
      expect(enzymeWrapper.find('.collection-details__more-granules-button').length).toEqual(1)
    })
  })

  describe('Load more granules button', () => {
    test('renders the load more granules button', () => {
      const { enzymeWrapper, props } = setup({
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
      })

      const button = enzymeWrapper.find('.collection-details__more-granules-button')
      button.props().onClick()

      expect(props.onChangeProjectGranulePageNum).toHaveBeenCalledTimes(1)
      expect(props.onChangeProjectGranulePageNum).toHaveBeenCalledWith({ collectionId: 'COLL-1', pageNum: 2 })
    })
  })
})
