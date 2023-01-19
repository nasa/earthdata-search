import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import {
  FaClock,
  FaFileAlt,
  FaGlobe,
  FaSlidersH,
  FaTags
} from 'react-icons/fa'

import { collectionListItemProps } from './mocks'

import CollectionResultsItem from '../CollectionResultsItem'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import MetaIcon from '../../MetaIcon/MetaIcon'
import Spinner from '../../Spinner/Spinner'

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

  describe('Browse image thumbnail', () => {
    describe('while the image is loading', () => {
      test('renders with the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__thumb').props().className).toContain('collection-results-item__thumb--is-loading')
      })

      test('renders with a spinner', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__thumb').find(Spinner).length).toEqual(1)
      })
    })

    describe('when the image has loaded', () => {
      test('renders with the loaded state', () => {
        const { enzymeWrapper } = setup()
        const thumbnail = enzymeWrapper.find('.collection-results-item__thumb-image')
        thumbnail.simulate('load')
        enzymeWrapper.update()
        expect(enzymeWrapper.find('.collection-results-item__thumb').props().className).toContain('collection-results-item__thumb--is-loaded')
      })

      test('renders without a spinner', () => {
        const { enzymeWrapper } = setup()
        const thumbnail = enzymeWrapper.find('.collection-results-item__thumb-image')
        thumbnail.simulate('load')
        enzymeWrapper.update()
        expect(enzymeWrapper.find('.collection-results-item__thumb').find(Spinner).length).toEqual(0)
      })
    })
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

  describe('collection metadata', () => {
    test('renders a cwic collection correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isOpenSearch: true
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__meta').text())
        .toContain('Int\'l / Interagency')
    })

    test('renders single granule correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 1
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__meta').text())
        .toContain('1 Granule')
    })

    test('renders no granules correctly', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 0
        }
      })
      expect(enzymeWrapper.find('.collection-results-item__meta').text())
        .toContain('0 Granules')
    })

    describe('date range', () => {
      test('with a range', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__meta').text())
          .toContain('2010-10-10 to 2011-10-10')
      })

      test('with no end time', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: '2010-10-10 ongoing'
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__meta').text())
          .toContain('2010-10-10 ongoing')
      })

      test('with no start time', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: 'Up to 2011-10-10'
          }
        })
        expect(enzymeWrapper.find('.collection-results-item__meta').text())
          .toContain('Up to 2011-10-10')
      })
    })

    describe('map imagery', () => {
      test('does not render when hasMapImagery not set', () => {
        const { enzymeWrapper } = setup()
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__map-imagery')
        expect(featureItem.length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__map-imagery')
          const metaIcon = featureItem.find(MetaIcon)
          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().label).toEqual('Map Imagery')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })

          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__map-imagery')
          const metaIcon = featureItem.find(MetaIcon)
          expect(metaIcon.props().tooltipContent).toEqual('Supports advanced map visualizations using the GIBS tile service')
        })
      })
    })

    describe('near real time', () => {
      test('does not render when hasMapImagery not set', () => {
        const { enzymeWrapper } = setup()
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__near-real-time')
        expect(featureItem.length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the label correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              collectionDataType: 'EXPEDITED',
              isNrt: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__near-real-time')
          const metaIcon = featureItem.find(MetaIcon)
          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().label).toEqual('Near Real Time')
        })

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              collectionDataType: 'EXPEDITED',
              isNrt: true,
              nrt: {
                label: '1 to 4 days',
                description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
              }
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__near-real-time')
          const metaIcon = featureItem.find(MetaIcon)
          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata).toEqual('1 to 4 days')
        })
      })

      test('renders a tooltip correctly', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            collectionDataType: 'EXPEDITED',
            isNrt: true,
            nrt: {
              label: '1 to 4 days',
              description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
            }
          }
        })

        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__near-real-time')
        const metaIcon = featureItem.find(MetaIcon)
        expect(metaIcon.props().tooltipContent).toEqual('Data is available 1 to 4 days after being acquired by the instrument on the satellite')
      })
    })

    describe('customize', () => {
      test('does not render when no customization flags are true', () => {
        const { enzymeWrapper } = setup({
          collection: collectionListItemProps.collectionMetadata
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem.length).toEqual(0)
      })

      describe('spatial subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasSpatialSubsetting: true
          }
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem).toBeDefined()

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasSpatialSubsetting: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__customize')
          const metaIcon = featureItem.find(MetaIcon)
          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata.props.children[0].props.icon).toEqual(FaGlobe)
        })
      })

      describe('variables icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasVariables: true
          }
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem).toBeDefined()

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasVariables: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__customize')
          const metaIcon = featureItem.find(MetaIcon)

          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata.props.children[2].props.icon).toEqual(FaTags)
        })
      })

      describe('transforms icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasTransforms: true
          }
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem).toBeDefined()

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasTransforms: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__customize')
          const metaIcon = featureItem.find(MetaIcon)

          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata.props.children[3].props.icon).toEqual(FaSlidersH)
        })
      })

      describe('formats icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasFormats: true
          }
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem).toBeDefined()

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasFormats: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__customize')
          const metaIcon = featureItem.find(MetaIcon)

          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata.props.children[4].props.icon).toEqual(FaFileAlt)
        })
      })

      describe('temporal subsetting icon', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            hasTemporalSubsetting: true
          }
        })
        const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        expect(featureItem).toBeDefined()

        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasTemporalSubsetting: true
            }
          })
          const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
          const featureItem = metaContainer.find('#feature-icon-list-view__customize')
          const metaIcon = featureItem.find(MetaIcon)

          expect(featureItem.length).toEqual(1)
          expect(metaIcon.props().metadata.props.children[1].props.icon).toEqual(FaClock)
        })
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

  describe('attribution information', () => {
    test('renders only the version information by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-results-item__attribution-list-item').length).toEqual(0)
      expect(enzymeWrapper.find('.collection-results-item__attribution-string').length).toEqual(1)
    })

    describe('short name and version information', () => {
      test('renders correctly', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__attribution-string').text()).toEqual('cId1 v2 - TESTORG')
      })
    })

    describe('CSDA', () => {
      test('does not render when isCSDA is not set', () => {
        const { enzymeWrapper } = setup()
        const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')

        expect(attributionList.children().length).toEqual(0)
      })

      describe('renders correctly when set', () => {
        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionText = attributionItem.find('.collection-results-item__list-text')

          expect(attributionList.children().length).toEqual(1)
          expect(attributionText.find(EDSCIcon).length).toEqual(1)
          expect(attributionText.text()).toContain('CSDA')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
          const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

          expect(attributionTooltipOverlay.text()).toEqual('Commercial Smallsat Data Acquisition Program(Additional authentication required)')
        })
      })
    })

    describe('consortium metadata', () => {
      test('does not render when the consortium is not set', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-results-item__attribution-list').children().length).toEqual(0)
      })

      describe('with a single consortium', () => {
        describe('renders correctly when set', () => {
          test('renders the metadata correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC']
              }
            })

            const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
            const attributionItem = attributionList.childAt(0)
            const attributionText = attributionItem.find('.collection-results-item__list-text')

            expect(attributionList.children().length).toEqual(1)
            expect(attributionText.text()).toEqual('CWIC')
          })

          test('renders a tooltip correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC']
              }
            })

            const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
            const attributionItem = attributionList.childAt(0)
            const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
            const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

            expect(attributionTooltipOverlay.text()).toEqual('CEOS WGISS Integrated Catalog')
          })
        })
      })

      describe('with a multiple consortiums', () => {
        describe('renders correctly when set', () => {
          test('renders the metadata correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
            const attributionItemOne = attributionList.childAt(0)
            const attributionTextOne = attributionItemOne.find('.collection-results-item__list-text')
            const attributionItemTwo = attributionList.childAt(1)
            const attributionTextTwo = attributionItemTwo.find('.collection-results-item__list-text')

            expect(attributionList.children().length).toEqual(2)
            expect(attributionTextOne.text()).toEqual('CWIC')
            expect(attributionTextTwo.text()).toEqual('GEOSS')
          })

          test('renders a tooltips correctly', () => {
            const { enzymeWrapper } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
            const attributionItemOne = attributionList.childAt(0)
            const attributionTootipOne = attributionItemOne.find('.collection-results-item__tooltip-container')
            const attributionTooltipOverlayOne = shallow(attributionTootipOne.props().overlay)
            const attributionItemTwo = attributionList.childAt(1)
            const attributionTootipTwo = attributionItemTwo.find('.collection-results-item__tooltip-container')
            const attributionTooltipOverlayTwo = shallow(attributionTootipTwo.props().overlay)

            expect(attributionTooltipOverlayOne.text()).toEqual('CEOS WGISS Integrated Catalog')
            expect(attributionTooltipOverlayTwo.text()).toEqual('Global Earth Observation System of Systems')
          })
        })
      })

      describe('when CWIC is defined', () => {
        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CWIC']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionText = attributionItem.find('.collection-results-item__list-text')

          expect(attributionList.children().length).toEqual(1)
          expect(attributionText.text()).toEqual('CWIC')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CWIC']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
          const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

          expect(attributionTooltipOverlay.text()).toEqual('CEOS WGISS Integrated Catalog')
        })
      })

      describe('when GEOSS is defined', () => {
        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['GEOSS']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionText = attributionItem.find('.collection-results-item__list-text')

          expect(attributionList.children().length).toEqual(1)
          expect(attributionText.text()).toEqual('GEOSS')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['GEOSS']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
          const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

          expect(attributionTooltipOverlay.text()).toEqual('Global Earth Observation System of Systems')
        })
      })

      describe('when FEDEO is defined', () => {
        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['FEDEO']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionText = attributionItem.find('.collection-results-item__list-text')

          expect(attributionList.children().length).toEqual(1)
          expect(attributionText.text()).toEqual('FEDEO')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['FEDEO']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
          const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

          expect(attributionTooltipOverlay.text()).toEqual('Federated EO Gateway')
        })
      })

      describe('when CEOS is defined', () => {
        test('renders the metadata correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CEOS']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionText = attributionItem.find('.collection-results-item__list-text')

          expect(attributionList.children().length).toEqual(1)
          expect(attributionText.text()).toEqual('CEOS')
        })

        test('renders a tooltip correctly', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              consortiums: ['CEOS']
            }
          })

          const attributionList = enzymeWrapper.find('.collection-results-item__attribution-list')
          const attributionItem = attributionList.childAt(0)
          const attributionTootip = attributionItem.find('.collection-results-item__tooltip-container')
          const attributionTooltipOverlay = shallow(attributionTootip.props().overlay)

          expect(attributionTooltipOverlay.text()).toEqual('Committee on Earth Observation Satellites')
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
