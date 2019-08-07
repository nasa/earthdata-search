import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GranuleResultsItem from '../GranuleResultsItem'
import * as EventEmitter from '../../../events/events'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const defaultProps = {
    collectionId: 'collectionId',
    focusedGranule: '',
    isFocused: false,
    isLast: false,
    location: { search: 'location' },
    waypointEnter: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn()
  }
  let props

  if (type === 'cmr') {
    props = {
      ...defaultProps,
      granule: {
        id: 'granuleId',
        browse_flag: true,
        formatted_temporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        links: [
          {
            rel: 'http://linkrel',
            title: 'linktitle',
            href: 'htt[://linkhref'
          }
        ]
      }
    }
  }
  if (type === 'focusedGranule') {
    props = {
      ...defaultProps,
      focusedGranule: 'granuleId',
      granule: {
        id: 'granuleId',
        browse_flag: true,
        formatted_temporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        links: [
          {
            rel: 'http://linkrel',
            title: 'linktitle',
            href: 'htt[://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'no-thumb') {
    props = {
      ...defaultProps,
      granule: {
        browse_flag: false,
        formatted_temporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        title: 'Granule title',
        links: [
          {
            rel: 'http://linkrel',
            title: 'linktitle',
            href: 'htt[://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'cwic') {
    props = {
      ...defaultProps,
      granule: {
        id: 'granuleId',
        browse_flag: true,
        formatted_temporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        is_cwic: true,
        producer_granule_id: 'Granule title',
        thumbnail: '/fake/path/image.jpg',
        links: [
          {
            rel: 'http://linkrel',
            title: 'linktitle',
            href: 'htt[://linkhref'
          }
        ]
      }
    }
  }

  const enzymeWrapper = shallow(<GranuleResultsItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GranuleResultsItem component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup('cmr')

    expect(enzymeWrapper.type()).toBe('li')
  })

  describe('when passed a CMR granule', () => {
    test('renders the title', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__title').text()).toEqual('Granule title')
    })

    test('renders the image', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__thumb').find('img').prop('src')).toEqual('/fake/path/image.jpg')
    })

    test('renders the start and end date', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('h5').text()).toEqual('Start')
      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('p').text()).toEqual('2019-04-28 00:00:00')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('h5').text()).toEqual('End')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('p').text()).toEqual('2019-04-29 23:59:59')
    })

    describe('without an thumbnail', () => {
      test('does not render an thumbnail', () => {
        const { enzymeWrapper } = setup('no-thumb')

        expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(0)
      })
    })
  })

  describe('when passed a CWIC granule', () => {
    test('renders the title', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__title').text()).toEqual('Granule title')
    })

    test('renders the image', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__thumb').find('img').prop('src')).toEqual('/fake/path/image.jpg')
    })

    test('renders the start and end date', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('h5').text()).toEqual('Start')
      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('p').text()).toEqual('2019-04-28 00:00:00')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('h5').text()).toEqual('End')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('p').text()).toEqual('2019-04-29 23:59:59')
    })
  })

  describe('when clicking the remove button', () => {
    describe('with CMR granules', () => {
      test('it excludes the granule from results', () => {
        const { enzymeWrapper, props } = setup('cmr')
        const removeButton = enzymeWrapper.find('button[title="Remove granule"]')

        removeButton.simulate('click')
        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: 'granuleId' }])
      })
    })

    describe('with CWIC granules', () => {
      test('it excludes the granule from results with a hashed granule id', () => {
        const { enzymeWrapper, props } = setup('cwic')
        const removeButton = enzymeWrapper.find('button[title="Remove granule"]')

        removeButton.simulate('click')
        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: '170417722' }])
      })
    })
  })

  describe('granule map events', () => {
    test('hovering over a granule highlights the granule on the map', () => {
      const { enzymeWrapper, props } = setup('cmr')

      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      const item = enzymeWrapper.find('.granule-results-item')
      item.simulate('mouseenter')

      expect(eventEmitterEmitMock).toBeCalledTimes(1)
      expect(eventEmitterEmitMock).toBeCalledWith('edsc.focusgranule', { granule: props.granule })

      jest.clearAllMocks()
      item.simulate('mouseleave')

      expect(eventEmitterEmitMock).toBeCalledTimes(1)
      expect(eventEmitterEmitMock).toBeCalledWith('edsc.focusgranule', { granule: null })
    })

    test('clicking on a granule sets that granule as sticky on the map', () => {
      const { enzymeWrapper, props } = setup('cmr')

      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      const itemHeader = enzymeWrapper.find('.granule-results-item__header')
      itemHeader.simulate('click')

      expect(eventEmitterEmitMock).toBeCalledTimes(1)
      expect(eventEmitterEmitMock).toBeCalledWith('edsc.stickygranule', { granule: props.granule })
    })

    test('clicking on a focused granule removes that granule as sticky on the map', () => {
      const { enzymeWrapper, props } = setup('focusedGranule')

      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      const itemHeader = enzymeWrapper.find('.granule-results-item__header')
      itemHeader.simulate('click')

      expect(eventEmitterEmitMock).toBeCalledTimes(1)
      expect(eventEmitterEmitMock).toBeCalledWith('edsc.stickygranule', { granule: null })
    })
  })
})
