import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SimpleBar from 'simplebar-react'

import { collectionDetailsBodyProps, metadata } from './mocks'
import CollectionDetailsBody from '../CollectionDetailsBody'
import CollectionDetailsMinimap from '../CollectionDetailsMinimap'
import SplitBadge from '../../SplitBadge/SplitBadge'
import Button from '../../Button/Button'
import ArrowTags from '../../ArrowTags/ArrowTags'
import CollapsePanel from '../../CollapsePanel/CollapsePanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: collectionDetailsBodyProps.focusedCollectionMetadata.metadata,
    formattedCollectionMetadata: collectionDetailsBodyProps.focusedCollectionMetadata.formattedMetadata,
    onToggleRelatedUrlsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionDetailsBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetails component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe(SimpleBar)
    expect(enzymeWrapper.prop('className')).toBe('collection-details-body')
  })

  describe('MiniMap component', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(CollectionDetailsMinimap).length).toEqual(1)
    })

    test('has the correct props', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(CollectionDetailsMinimap).props().metadata).toEqual(metadata)
    })
  })

  describe('Spatial bounding', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__spatial-bounding').text()).toEqual(
        'Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)'
      )
    })
  })

  describe('DOI Badge', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(SplitBadge).length).toEqual(1)
    })

    test('has the correct props', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(SplitBadge).props()).toEqual({
        className: null,
        primary: 'DOI',
        secondary: '10.3334/ORNLDAAC/830',
        variant: 'primary'
      })
    })

    test('is wrapped in a link', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__doi').props().href).toEqual(
        'https://dx.doi.org/10.3334/ORNLDAAC/830'
      )
    })
  })

  describe('Related URLs', () => {
    test('renders its links correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(0).props().href).toEqual(
        'https://doi.org/10.3334/ORNLDAAC/830'
      )
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(0).text()).toEqual(
        'Data Set Landing Page'
      )
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(1).find(Button).props().href).toEqual(null)
      expect(typeof enzymeWrapper.find('.collection-details-body__related-link').at(1).find(Button).props().onClick).toEqual('function')
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(1).find(Button).props().bootstrapVariant).toEqual('link')
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(2).props().href).toEqual(
        'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.html'
      )
      expect(enzymeWrapper.find('.collection-details-body__related-link').at(2).text()).toEqual(
        'View More Info'
      )
    })
  })

  describe('Temporal extent', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__info').find('dd').at(1).text()).toEqual(
        '1860-01-01 to 2050-12-31'
      )
    })
  })

  describe('GIBS layers', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__info').find('dd').at(2).text()).toEqual(
        'None'
      )
    })
  })

  describe('Science Keywords', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__keywords').find(ArrowTags).props()).toEqual({
        className: '',
        tags: ['Earth Science', 'Atmosphere', 'Atmospheric Chemistry']
      })
    })
  })

  describe('Native Data Formats', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-details-body__native-formats').text()).toEqual('PDF')
    })
  })

  describe('Summary', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      // eslint-disable-next-line no-underscore-dangle
      expect(enzymeWrapper.find('.collection-details-body__summary').text()).toEqual(
        'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.'
      )
    })
  })

  describe('For developers panel', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(SplitBadge).length).toEqual(1)
    })

    test('has the correct props', () => {
      const { enzymeWrapper } = setup()
      const children = enzymeWrapper.find(CollapsePanel).children()
      expect(enzymeWrapper.find(CollapsePanel).props().className).toEqual('collection-details-body__for-devs')
      expect(enzymeWrapper.find(CollapsePanel).props().header).toEqual('For Developers')
      expect(enzymeWrapper.find(CollapsePanel).props().panelClassName).toEqual('')
      expect(enzymeWrapper.find(CollapsePanel).props().scrollToBottom).toEqual(true)
      expect(children.find('.collection-details-body__dev-list a').length).toEqual(7)
    })
  })
})
