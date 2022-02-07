import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { LinkContainer } from 'react-router-bootstrap'

import Button from '../../Button/Button'
import GranuleResultsItem from '../GranuleResultsItem'
import GranuleResultsDataLinksButton from '../GranuleResultsDataLinksButton'
import MoreActionsDropdownItem from '../../MoreActionsDropdown/MoreActionsDropdownItem'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(type, overrideProps) {
  const defaultProps = {
    browseUrl: undefined,
    collectionId: 'collectionId',
    directDistributionInformation: {},
    focusedGranule: '',
    isCollectionInProject: false,
    isGranuleInProject: jest.fn(() => false),
    isFocused: false,
    isLast: false,
    isProjectGranulesLoading: false,
    location: { search: 'location' },
    onAddGranuleToProjectCollection: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    portal: {
      features: {
        authentication: true
      }
    }
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
        ],
        s3Links: []
      }
    }
  }

  if (type === 'cmr-s3') {
    props = {
      ...defaultProps,
      directDistributionInformation: {
        region: 's3-region'
      },
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
        ],
        s3Links: [
          {
            rel: 'http://linkrel/s3#',
            title: 'linktitle',
            href: 's3://linkhref'
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
        ],
        s3Links: []
      }
    }
  }

  if (type === 'focused-granule') {
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
        isFocusedGranule: true,
        isHoveredGranule: false,
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
        ],
        s3Links: []
      }
    }
  }

  if (type === 'hovered-granule') {
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
        isFocusedGranule: false,
        isHoveredGranule: true,
        timeStart: '2019-04-28 00:00:00',
        timeEnd: '2019-04-29 23:59:59',
        granuleThumbnail: '/fake/path/image.jpg',
        title: 'Granule title',
        dataLinks: [{
          rel: 'http://linkrel',
          title: 'linktitle',
          href: 'http://linkhref'
        }],
        s3Links: []
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
        ],
        s3Links: []
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
        ],
        s3Links: []
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
        isOpenSearch: true,
        granuleThumbnail: '/fake/path/image.jpg',
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ],
        s3Links: []
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
        ],
        s3Links: []
      },
      isLast: true
    }
  }

  if (type === 'override') {
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
        ],
        s3Links: []
      },
      ...overrideProps
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

  test('renders the add button under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup('cmr')

    const button = enzymeWrapper
      .find(PortalFeatureContainer)
      .find('.granule-results-item__button--add')
    const portalFeatureContainer = button.parents(PortalFeatureContainer)

    expect(button.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().authentication).toBeTruthy()
  })

  describe('when passed a focused granule', () => {
    test('adds the correct classname', () => {
      const {
        enzymeWrapper
      } = setup('focused-granule')

      expect(enzymeWrapper.props().className).toContain('granule-results-item--active')
    })
  })

  describe('when passed a hovered granule', () => {
    test('adds the correct classname', () => {
      const {
        enzymeWrapper
      } = setup('hovered-granule')

      expect(enzymeWrapper.props().className).toContain('granule-results-item--active')
    })
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

  describe('when passed s3 links', () => {
    test('passes the direct distribution information to the data links button', () => {
      const { enzymeWrapper } = setup('cmr-s3')
      const dataLinksButtonProps = enzymeWrapper.find(GranuleResultsDataLinksButton).props()

      expect(dataLinksButtonProps.directDistributionInformation).toEqual({
        region: 's3-region'
      })
    })

    test('passes the s3 links to the data links button', () => {
      const { enzymeWrapper } = setup('cmr-s3')
      const dataLinksButtonProps = enzymeWrapper.find(GranuleResultsDataLinksButton).props()

      expect(dataLinksButtonProps.s3Links).toEqual([
        {
          rel: 'http://linkrel/s3#',
          title: 'linktitle',
          href: 's3://linkhref'
        }
      ])
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
      test('it removes the granule from results', () => {
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

  describe('when no granules are in the project', () => {
    test('does not have an emphisized or deepmphisized class', () => {
      const { enzymeWrapper } = setup('cmr')
      expect(enzymeWrapper.props().className).not.toContain('granule-results-item--emphisized')
      expect(enzymeWrapper.props().className).not.toContain('granule-results-item--deemphisized')
    })

    test('displays the add button', () => {
      const { enzymeWrapper } = setup('cmr')
      const addButton = enzymeWrapper.find(Button)

      expect(addButton.props().title).toContain('Add granule')
    })
  })

  describe('when displaying granules in the project', () => {
    describe('when displaying granule in the project', () => {
      test('displays the remove button', () => {
        const { enzymeWrapper } = setup('override', {
          isGranuleInProject: jest.fn(() => true),
          isCollectionInProject: true
        })
        const addButton = enzymeWrapper.find(Button)

        expect(addButton.props().title).toContain('Remove granule')
        expect(enzymeWrapper.props().className).toContain('granule-results-item--emphisized')
      })
    })

    describe('when displaying granule not in the project', () => {
      test('displays the add button', () => {
        const { enzymeWrapper } = setup('override', {
          isGranuleInProject: jest.fn(() => false),
          isCollectionInProject: true
        })
        const addButton = enzymeWrapper.find(Button)

        expect(addButton.props().title).toContain('Add granule')
        expect(enzymeWrapper.props().className).toContain('granule-results-item--deemphisized')
      })
    })
  })

  describe('when clicking the add button', () => {
    test('it adds the granule to the project', () => {
      const { enzymeWrapper, props } = setup('cmr')
      const addButton = enzymeWrapper.find(Button)

      expect(addButton.props().title).toContain('Add granule')

      const mockEvent = {
        stopPropagation: jest.fn()
      }

      addButton.simulate('click', mockEvent)
      expect(props.onAddGranuleToProjectCollection.mock.calls.length).toBe(1)
      expect(props.onAddGranuleToProjectCollection.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: 'granuleId' }])
      expect(mockEvent.stopPropagation.mock.calls.length).toBe(1)
      expect(mockEvent.stopPropagation.mock.calls[0]).toEqual([])
    })
  })

  describe('when clicking the remove button', () => {
    test('it removes the granule to the project', () => {
      const { enzymeWrapper, props } = setup('override', {
        isGranuleInProject: jest.fn(() => true)
      })

      const removeButton = enzymeWrapper.find(Button)

      expect(removeButton.props().title).toContain('Remove granule')

      const mockEvent = {
        stopPropagation: jest.fn()
      }

      removeButton.simulate('click', mockEvent)
      expect(props.onRemoveGranuleFromProjectCollection.mock.calls.length).toBe(1)
      expect(props.onRemoveGranuleFromProjectCollection.mock.calls[0]).toEqual([{ collectionId: 'collectionId', granuleId: 'granuleId' }])
      expect(mockEvent.stopPropagation.mock.calls.length).toBe(1)
      expect(mockEvent.stopPropagation.mock.calls[0]).toEqual([])
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

  describe('without an granuleThumbnail', () => {
    test('does not render an granuleThumbnail', () => {
      const { enzymeWrapper } = setup('no-thumb')

      expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(0)
    })

    test('does not add the modifier class name', () => {
      const { enzymeWrapper } = setup('no-thumb')

      expect(enzymeWrapper.props().className).not.toContain('granule-results-item--has-thumbnail')
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

    test('adds the modifier class name', () => {
      const { enzymeWrapper } = setup('with-browse')

      expect(enzymeWrapper.props().className).toContain('granule-results-item--has-thumbnail')
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
