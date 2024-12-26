import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Tabs, Tab } from 'react-bootstrap'

import { granuleResultsBodyProps } from './mocks'

import GranuleDetailsBody from '../GranuleDetailsBody'
import GranuleDetailsInfo from '../GranuleDetailsInfo'
import GranuleDetailsMetadata from '../GranuleDetailsMetadata'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = granuleResultsBodyProps

  const enzymeWrapper = shallow(<GranuleDetailsBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-details-body')
  })

  describe('Tabs component', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Tabs).length).toEqual(1)
    })

    test('shows the Information tab by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Tabs).props().defaultActiveKey).toEqual('information')
    })

    test('renders its Tab children correctly', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Tab).length).toEqual(2)

      // Information tab
      const infoTab = enzymeWrapper.find(Tab).at(0)
      expect(infoTab.props().eventKey).toEqual('information')
      expect(infoTab.props().title).toEqual('Information')
      expect(infoTab.find(GranuleDetailsInfo).length).toEqual(1)
      expect(infoTab.find(GranuleDetailsInfo).props().granuleMetadata)
        .toEqual(granuleResultsBodyProps.granuleMetadata)

      // Metadata tab
      const metaTab = enzymeWrapper.find(Tab).at(1)
      expect(metaTab.props().eventKey).toEqual('metadata')
      expect(metaTab.props().title).toEqual('Metadata')
      expect(metaTab.find(GranuleDetailsMetadata).length).toEqual(1)
      expect(metaTab.find(GranuleDetailsMetadata).props().metadataUrls)
        .toEqual(granuleResultsBodyProps.granuleMetadata.metadataUrls)
    })
  })
})
