import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OverlayTrigger, Overlay, Tooltip } from 'react-bootstrap'

import CollectionResultsItem from '../CollectionResultsItem'
import SplitBadge from '../../SplitBadge/SplitBadge'
import { collectionListItemProps } from './mocks'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

const popperOffset = {
  name: 'offset',
  options: {
    offset: [0, 6]
  }
}

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
    expect(enzymeWrapper.type()).toEqual('div')
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

  test('renders the add button under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const button = enzymeWrapper
      .find(PortalFeatureContainer)
      .find('.collection-results-item__action--add')
    const portalFeatureContainer = button.parents(PortalFeatureContainer)

    expect(button.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().authentication).toBeTruthy()
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
    test('renders a cwic collection correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isOpenSearch: true
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('Int\'l / Interagency')
    })

    test('renders single granule correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 1
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__desc').text())
        .toContain('1 Granule')
    })

    test('renders no granules correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 0
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
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: '2010-10-10 ongoing'
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__desc').text())
          .toContain('2010-10-10 ongoing')
      })

      test('with no start time', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: 'Up to 2011-10-10'
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

    describe('consortium badge', () => {
      test('does not render when the consortium is not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--cwic').length).toEqual(0)
      })

      describe('with a single consortium', () => {
        describe('renders correctly when set', () => {
          test('renders the badge correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC']
              }
            })

            const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
            expect(overlayWrapper.length).toEqual(1)
            const overlay = shallow(
              shallow(overlayWrapper.props().children.props.children[0]).props().children
            ).childAt(0).childAt(0)
            expect(overlay.text()).toEqual('CWIC')
          })

          test('renders a tooltip correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC']
              }
            })

            const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
            const overlayText = shallow(
              shallow(overlay.props().children.props.children[0]).props().children
            ).childAt(1).childAt(0).text()
            expect(overlayText).toEqual('CEOS WGISS Integrated Catalog')
          })
        })
      })

      describe('with a multiple consortiums', () => {
        describe('renders correctly when set', () => {
          test('renders the badge correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
            expect(overlayWrapper.length).toEqual(1)
            const consortiumOne = shallow(
              shallow(overlayWrapper.props().children.props.children[0]).props().children
            ).childAt(0).childAt(0)
            const consortiumTwo = shallow(
              shallow(overlayWrapper.props().children.props.children[1]).props().children
            ).childAt(0).childAt(0)
            expect(consortiumOne.text()).toEqual('CWIC')
            expect(consortiumTwo.text()).toEqual('GEOSS')
          })

          test('renders a tooltips correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
            const overlayOneText = shallow(
              shallow(overlay.props().children.props.children[0]).props().children
            ).childAt(1).childAt(0).text()
            const overlayTwoText = shallow(
              shallow(overlay.props().children.props.children[1]).props().children
            ).childAt(1).childAt(0).text()
            expect(overlayOneText).toEqual('CEOS WGISS Integrated Catalog')
            expect(overlayTwoText).toEqual('Global Earth Observation System of Systems')
          })
        })
      })

      describe('when CWIC is defined', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CWIC']
            }
          })

          const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          expect(overlayWrapper.length).toEqual(1)
          const overlay = shallow(
            shallow(overlayWrapper.props().children.props.children[0]).props().children
          ).childAt(0).childAt(0)
          expect(overlay.text()).toEqual('CWIC')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CWIC']
            }
          })

          const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          const overlayText = shallow(
            shallow(overlay.props().children.props.children[0]).props().children
          ).childAt(1).childAt(0).text()
          expect(overlayText).toEqual('CEOS WGISS Integrated Catalog')
        })
      })

      describe('when GEOSS is defined', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['GEOSS']
            }
          })

          const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          expect(overlayWrapper.length).toEqual(1)
          const overlay = shallow(
            shallow(overlayWrapper.props().children.props.children[0]).props().children
          ).childAt(0).childAt(0)
          expect(overlay.text()).toEqual('GEOSS')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['GEOSS']
            }
          })

          const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          const overlayText = shallow(
            shallow(overlay.props().children.props.children[0]).props().children
          ).childAt(1).childAt(0).text()
          expect(overlayText).toEqual('Global Earth Observation System of Systems')
        })
      })

      describe('when FEDEO is defined', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['FEDEO']
            }
          })

          const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          expect(overlayWrapper.length).toEqual(1)
          const overlay = shallow(
            shallow(overlayWrapper.props().children.props.children[0]).props().children
          ).childAt(0).childAt(0)
          expect(overlay.text()).toEqual('FEDEO')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['FEDEO']
            }
          })

          const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          const overlayText = shallow(
            shallow(overlay.props().children.props.children[0]).props().children
          ).childAt(1).childAt(0).text()
          expect(overlayText).toEqual('Federated EO Gateway')
        })
      })

      describe('when CEOS is defined', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CEOS']
            }
          })

          const overlayWrapper = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          expect(overlayWrapper.length).toEqual(1)
          const overlay = shallow(
            shallow(overlayWrapper.props().children.props.children[0]).props().children
          ).childAt(0).childAt(0)
          expect(overlay.text()).toEqual('CEOS')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CEOS']
            }
          })

          const overlay = enzymeWrapper.find('.collection-results-item__badge--external-broker')
          const overlayText = shallow(
            shallow(overlay.props().children.props.children[0]).props().children
          ).childAt(1).childAt(0).text()
          expect(overlayText).toEqual('Committee on Earth Observation Satellites')
        })
      })
    })

    describe('CSDA badge', () => {
      test('does not render when isCSDA is not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--cwic').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--csda').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--csda').text()).toContain('CSDA')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })

          const tooltipProps = enzymeWrapper.find(OverlayTrigger).props().overlay.props
          expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
          expect(tooltipProps.children[0]).toEqual('Commercial Smallsat Data Acquisition Program')
          expect(shallow(tooltipProps.children[1]).text()).toEqual('(Additional authentication required)')
        })
      })
    })

    describe('map imagery badge', () => {
      test('does not render when hasMapImagery not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--map-imagery').text()).toEqual('Map Imagery')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })

          const tooltipProps = enzymeWrapper.find(OverlayTrigger).props().overlay.props
          expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
          expect(tooltipProps.children).toEqual('Supports advanced map visualizations using the GIBS tile service')
        })
      })
    })

    describe('near real time badge', () => {
      test('does not render when hasMapImagery not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isNrt: true
            }
          })
          expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').length).toEqual(1)
          expect(enzymeWrapper.find('.collection-results-item__badge--near-real-time').text()).toEqual('NRT')
        })
      })

      test('renders a tooltip correctly', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            isNrt: true
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
          collection: collectionListItemProps.collectionMetadata
        })
        expect(enzymeWrapper.find('.collection-results-item__badge--customizable').length).toEqual(0)
      })

      describe('spatial subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasSpatialSubsetting: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-globe-svg').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Spatial customizable options available')
        })

        test('renders a tooltip with the correct popperConfig', () => {
          expect(tooltip.find(Overlay).props().popperConfig.modifiers[0]).toEqual(popperOffset)
        })
      })

      describe('variables icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasVariables: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-tags-svg').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Variable customizable options available')
        })

        test('renders a tooltip with the correct popperConfig', () => {
          expect(tooltip.find(Overlay).props().popperConfig.modifiers[0]).toEqual(popperOffset)
        })
      })

      describe('transforms icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasTransforms: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-sliders-svg').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Data transformation options available')
        })

        test('renders a tooltip with the correct popperConfig', () => {
          expect(tooltip.find(Overlay).props().popperConfig.modifiers[0]).toEqual(popperOffset)
        })
      })

      describe('formats icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasFormats: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-file-svg').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Reformatting options available')
        })

        test('renders a tooltip with the correct popperConfig', () => {
          expect(tooltip.find(Overlay).props().popperConfig.modifiers[0]).toEqual(popperOffset)
        })
      })

      describe('temporal subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasTemporalSubsetting: true
          }
        })
        const customizeBadge = enzymeWrapper.find('.collection-results-item__badge--customizable')
        const tooltip = shallow(customizeBadge.props().secondary[0])

        test('renders the correct component', () => {
          expect(enzymeWrapper.find('.collection-results-item__badge--customizable').type()).toEqual(SplitBadge)
        })

        test('renders correctly when set', () => {
          expect(tooltip.find('.fa-clock-svg').length).toEqual(1)
        })

        test('renders a tooltip with the correct text', () => {
          expect(tooltip.find(Tooltip).text()).toEqual('Temporal subsetting options available')
        })

        test('renders a tooltip with the correct popperConfig', () => {
          expect(tooltip.find(Overlay).props().popperConfig.modifiers[0]).toEqual(popperOffset)
        })
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
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isCollectionInProject: true
        }
      })

      expect(enzymeWrapper.find('.collection-results-item__action--remove').exists()).toBeTruthy()
    })

    test('clicking the button removes the collection from the project', () => {
      const { enzymeWrapper, props } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isCollectionInProject: true
        }
      })

      const button = enzymeWrapper.find('.collection-results-item__action--remove')
      button.simulate('click', { stopPropagation: jest.fn() })

      expect(props.onRemoveCollectionFromProject.mock.calls.length).toBe(1)
    })
  })
})
