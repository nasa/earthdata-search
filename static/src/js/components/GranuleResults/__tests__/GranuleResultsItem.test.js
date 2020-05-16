import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { LinkContainer } from 'react-router-bootstrap'
import GranuleResultsItem from '../GranuleResultsItem'
import GranuleResultsDataLinksButton from '../GranuleResultsDataLinksButton'
import MoreActionsDropdownItem from '../../MoreActionsDropdown/MoreActionsDropdownItem'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const defaultProps = {
    browseUrl: undefined,
    collectionId: 'collectionId',
    focusedGranule: '',
    isFocused: false,
    isLast: false,
    location: { search: 'location' },
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    portal: {}
  }
  let props

  if (type === 'cmr') {
    props = {
      ...defaultProps,
      granule: {
        id: 'granuleId',
        browseFlag: true,
        onlineAccessFlag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        granuleThumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'cmr-no-download') {
    props = {
      ...defaultProps,
      granule: {
        id: 'granuleId',
        browseFlag: true,
        onlineAccessFlag: false,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        granuleThumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 's3://bucket/filename'
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
        browseFlag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        granuleThumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        dataLinks: [
          {
            rel: 'http://linkrel',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'no-thumb') {
    props = {
      ...defaultProps,
      granule: {
        browseFlag: false,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        title: 'Granule title',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'with-browse') {
    props = {
      ...defaultProps,
      granule: {
        browseFlag: true,
        browseUrl: 'https://test.com/browse_image',
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        title: 'Granule title',
        granuleThumbnail: '/fake/path/image.jpg',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
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
        browseFlag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        title: 'Granule title',
        is_cwic: true,
        granuleThumbnail: '/fake/path/image.jpg',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      }
    }
  }

  if (type === 'is-last') {
    props = {
      ...defaultProps,
      granule: {
        id: 'granuleId',
        browseFlag: true,
        onlineAccessFlag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        granuleThumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      },
      isLast: true
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

    expect(enzymeWrapper.exists()).toEqual(true)
    expect(enzymeWrapper.type()).toBe('div')
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
        const removeButton = enzymeWrapper.find(MoreActionsDropdownItem).at(1)

        removeButton.simulate('click')
        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: 'granuleId' }])

        expect(removeButton.props().title).toEqual('Filter granule')
      })
    })

    describe('with CWIC granules', () => {
      test('it excludes the granule from results with a hashed granule id', () => {
        const { enzymeWrapper, props } = setup('cwic')
        const removeButton = enzymeWrapper.find(MoreActionsDropdownItem).at(1)

        removeButton.simulate('click')
        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: '170417722' }])

        expect(removeButton.props().title).toEqual('Filter granule')
      })
    })
  })

  describe('download button', () => {
    test('is passed the metrics callback', () => {
      const { enzymeWrapper, props } = setup('cmr')
      const dataLinksButton = enzymeWrapper.find(GranuleResultsDataLinksButton)

      expect(dataLinksButton.props().onMetricsDataAccess).toEqual(props.onMetricsDataAccess)
    })
  })

  describe('download button with no link', () => {
    test('disables the button', () => {
      const { enzymeWrapper } = setup('cmr-no-download')

      const downloadButton = enzymeWrapper.find(GranuleResultsDataLinksButton)

      expect(downloadButton.length).toEqual(0)
    })
  })

  // describe('granule map events', () => {
  //   test('hovering over a granule highlights the granule on the map', () => {
  //     const { enzymeWrapper, props } = setup('cmr')

  //     const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
  //     eventEmitterEmitMock.mockImplementation(() => jest.fn())

  //     const item = enzymeWrapper.find('.granule-results-item')
  //     item.simulate('mouseenter')

  //     expect(eventEmitterEmitMock).toBeCalledTimes(1)
  //     expect(eventEmitterEmitMock).toBeCalledWith('map.focusgranule', { granule: props.granule })

  //     jest.clearAllMocks()
  //     item.simulate('mouseleave')

  //     expect(eventEmitterEmitMock).toBeCalledTimes(1)
  //     expect(eventEmitterEmitMock).toBeCalledWith('map.focusgranule', { granule: null })
  //   })

  //   test('clicking on a granule sets that granule as sticky on the map', () => {
  //     const { enzymeWrapper, props } = setup('cmr')

  //     const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
  //     eventEmitterEmitMock.mockImplementation(() => jest.fn())

  //     const itemHeader = enzymeWrapper.find('.granule-results-item__header')
  //     itemHeader.simulate('click')

  //     expect(eventEmitterEmitMock).toBeCalledTimes(1)
  //     expect(eventEmitterEmitMock).toBeCalledWith('map.stickygranule', { granule: props.granule })
  //   })

  //   test('clicking on a focused granule removes that granule as sticky on the map', () => {
  //     const { enzymeWrapper } = setup('focusedGranule')

  //     const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
  //     eventEmitterEmitMock.mockImplementation(() => jest.fn())

  //     const itemHeader = enzymeWrapper.find('.granule-results-item__header')
  //     itemHeader.simulate('click')

  //     expect(eventEmitterEmitMock).toBeCalledTimes(1)
  //     expect(eventEmitterEmitMock).toBeCalledWith('map.stickygranule', { granule: null })
  //   })
  // })

  describe('without an granuleThumbnail', () => {
    test('does not render an granuleThumbnail', () => {
      const { enzymeWrapper } = setup('no-thumb')

      expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(0)
    })
  })

  describe('with a granuleThumbnail', () => {
    test('without a full size browse', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(1)
      expect(enzymeWrapper.find('.granule-results-item__thumb').type()).toEqual('div')
    })

    test('with a full size browse', () => {
      const { enzymeWrapper } = setup('with-browse')
      expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(1)
      expect(enzymeWrapper.find('.granule-results-item__thumb').type()).toEqual('a')
    })
  })

  describe('granule info button', () => {
    test('calls handleClickGranuleDetails on click', () => {
      const { enzymeWrapper, props } = setup('cmr')

      const infoButton = enzymeWrapper.find(LinkContainer).at(0)

      infoButton.simulate('click')

      expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('granuleId')
    })
  })
})
