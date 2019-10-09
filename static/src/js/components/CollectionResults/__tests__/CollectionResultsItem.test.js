import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Waypoint } from 'react-waypoint'

import CollectionResultsItem from '../CollectionResultsItem'
import SplitBadge from '../../SplitBadge/SplitBadge'
import { collectionListItemProps, longSummary } from './mocks'

// TODO: Write more tests

Enzyme.configure({ adapter: new Adapter() })

function setup(propsOverride) {
  const props = {
    ...collectionListItemProps,
    ...propsOverride
  }

  const enzymeWrapper = shallow(<CollectionResultsItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsList component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toEqual('li')
    expect(enzymeWrapper.props().className).toEqual('collection-results-item')
  })

  test('calls onViewCollectionGranules when clicked', () => {
    const { enzymeWrapper, props } = setup()
    const stopPropagationMock = jest.fn()
    enzymeWrapper.find('.collection-results-item__link').simulate('click', {
      stopPropagation: stopPropagationMock
    })
    expect(props.onViewCollectionGranules).toHaveBeenCalledTimes(1)
    expect(props.onViewCollectionGranules).toHaveBeenCalledWith('collectionId1')
    expect(stopPropagationMock).toHaveBeenCalledTimes(1)
  })

  describe('on keypress', () => {
    test('does nothing on non-enter press', () => {
      const { enzymeWrapper, props } = setup()
      const stopPropagationMock = jest.fn()
      enzymeWrapper.find('.collection-results-item__link').simulate('keypress', {
        key: 'A',
        stopPropagation: stopPropagationMock
      })
      expect(props.onViewCollectionGranules).toHaveBeenCalledTimes(0)
      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })

    test('calls onViewCollectionGranules on enter press', () => {
      const { enzymeWrapper, props } = setup()
      const stopPropagationMock = jest.fn()
      enzymeWrapper.find('.collection-results-item__link').simulate('keypress', {
        key: 'Enter',
        stopPropagation: stopPropagationMock
      })
      expect(props.onViewCollectionGranules).toHaveBeenCalledTimes(1)
      expect(props.onViewCollectionGranules).toHaveBeenCalledWith('collectionId1')
      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })

  test('renders thumbnail correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.collection-results-item__thumb-image').props().src)
      .toEqual('http://some.test.com/thumbnail/url.jpg')
    expect(enzymeWrapper.find('.collection-results-item__thumb-image').props().alt)
      .toEqual('Thumbnail for Test Collection')
    expect(enzymeWrapper.find('.collection-results-item__thumb-image').props().height)
      .toEqual(85)
    expect(enzymeWrapper.find('.collection-results-item__thumb-image').props().width)
      .toEqual(85)
  })

  test('renders title correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.collection-results-item__title').text())
      .toEqual('Test Collection')
  })

  describe('collection description', () => {
    test('renders standard description correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('This is a short summary.')
    })

    describe('renders long description correctly', () => {
      test('for ie browsers', () => {
        const { enzymeWrapper } = setup({
          browser: {
            name: 'ie'
          },
          collection: {
            ...collectionListItemProps.collection,
            summary: longSummary
          }
        })

        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupt...')
      })

      test('for non-ie browsers', () => {
        const { enzymeWrapper } = setup({
          browser: {
            name: 'something else'
          },
          collection: {
            ...collectionListItemProps.collection,
            summary: longSummary
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain(longSummary)
      })
    })

    test('renders a cwic collection correctly', () => {
      const { enzymeWrapper } = setup({
        collection: {
          ...collectionListItemProps.collection,
          is_cwic: true
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('Int\'l / Interagency')
    })

    test('renders single granule correctly', () => {
      const { enzymeWrapper } = setup({
        collection: {
          ...collectionListItemProps.collection,
          granule_count: 1
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('1 Granule')
    })

    test('renders no granules correctly', () => {
      const { enzymeWrapper } = setup({
        collection: {
          ...collectionListItemProps.collection,
          granule_count: 0
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('0 Granules')
    })

    describe('date range', () => {
      test('with a range', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain('2010-10-10 to 2011-10-10')
      })

      test('with no end time', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            time_end: null
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain('2010-10-10 ongoing')
      })

      test('with no start time', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            time_start: null
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain('Up to 2011-10-10')
      })
    })
  })

  describe('view collection details button', () => {
    test('calls onViewCollectionGranules when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const stopPropagationMock = jest.fn()
      enzymeWrapper.find('.collection-results-item__action--collection-details').simulate('click', {
        stopPropagation: stopPropagationMock
      })
      expect(props.onViewCollectionDetails).toHaveBeenCalledTimes(1)
      expect(props.onViewCollectionDetails).toHaveBeenCalledWith('collectionId1')
      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('badges', () => {
    test('renders only the version information by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-results-item__badge--attribution').length).toEqual(1)
    })

    describe('version information', () => {
      test('renders correctly', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--attribution').text()).toEqual('cId1 v2 - TESTORG')
      })
    })

    describe('cwic badge', () => {
      test('does not render when is_cwic is not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--cwic').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collection: {
              ...collectionListItemProps.collection,
              is_cwic: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--cwic').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--cwic').text()).toEqual('CWIC')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collection: {
              ...collectionListItemProps.collection,
              is_cwic: true
            }
          })

          const tooltipProps = enzymeWrapper.find(OverlayTrigger).props().overlay.props
          expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
          expect(tooltipProps.children).toEqual('Int\'l / Interagency Data')
        })
      })
    })

    describe('map imagery badge', () => {
      test('does not render when has_map_imagery not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collection: {
              ...collectionListItemProps.collection,
              has_map_imagery: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').text()).toEqual('Map Imagery')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collection: {
              ...collectionListItemProps.collection,
              has_map_imagery: true
            }
          })

          const tooltipProps = enzymeWrapper.find(OverlayTrigger).props().overlay.props
          expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
          expect(tooltipProps.children).toEqual('Supports advanced map visualizations using the GIBS tile service')
        })
      })
    })

    describe('near real time badge', () => {
      test('does not render when has_map_imagery not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collection: {
              ...collectionListItemProps.collection,
              is_nrt: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').text()).toEqual('NRT')
        })
      })

      test('renders a tooltip correctly', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            is_nrt: true
          }
        })

        const tooltipProps = enzymeWrapper.find(OverlayTrigger).props().overlay.props
        expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
        expect(tooltipProps.children).toEqual('Near Real Time (NRT) Data')
      })
    })

    describe('customize badge', () => {
      test('does not render when no customization flags are true', () => {
        const { enzymeWrapper } = setup({
          collection: collectionListItemProps.collection
        })
        expect(enzymeWrapper.find('.collection-results-item__badge--customizable').length).toEqual(0)
      })

      describe('spatial subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            has_spatial_subsetting: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-globe').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Spatial customizable options available')
        })
      })

      describe('variables icon', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            has_variables: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-tags').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Variable customizable options available')
        })
      })

      describe('transforms icon', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            has_transforms: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-sliders').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Data transformation options available')
        })
      })

      describe('formats icon', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            has_formats: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-file-text-o').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Reformatting options available')
        })
      })

      describe('temporal subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collection: {
            ...collectionListItemProps.collection,
            has_temporal_subsetting: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-clock-o').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Temporal subsetting options available')
        })
      })
    })
  })

  describe('waypoint', () => {
    test('does not render by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Waypoint).length)
        .toEqual(0)
    })

    describe('when the last item in the list', () => {
      test('renders the waypoint', () => {
        const { enzymeWrapper } = setup({
          isLast: true
        })
        expect(enzymeWrapper.find(Waypoint).length)
          .toEqual(1)
      })

      test('should pass the scrollContainer to the Waypoint', () => {
        const { enzymeWrapper, props } = setup({
          isLast: true
        })

        expect(enzymeWrapper.find('Waypoint').prop('scrollableAncestor'))
          .toEqual(props.scrollContainer)
      })
    })
  })

  describe('addToProjectButton', () => {
    test('shows the add button when the collection is not in the project', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.collection-results-item__action--add').exists()).toBeTruthy()
    })

    test('clicking the button adds the collection to the project', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.collection-results-item__action--add')
      button.simulate('click', { stopPropagation: jest.fn() })

      expect(props.onAddProjectCollection.mock.calls.length).toBe(1)
    })
  })

  describe('removeFromProjectButton', () => {
    test('shows the remove button when the collection is in the project', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        isCollectionInProject: true
      })

      expect(enzymeWrapper.find('.collection-results-item__action--remove').exists()).toBeTruthy()
    })

    test('clicking the button removes the collection from the project', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setProps({
        isCollectionInProject: true
      })

      const button = enzymeWrapper.find('.collection-results-item__action--remove')
      button.simulate('click', { stopPropagation: jest.fn() })

      expect(props.onRemoveCollectionFromProject.mock.calls.length).toBe(1)
    })
  })
})
