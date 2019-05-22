import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { granuleResultsBodyProps } from './mocks'
import GranuleDetailsMetadata from '../GranuleDetailsMetadata'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: '',
    metadataUrls: granuleResultsBodyProps.metadataUrls
  }

  const enzymeWrapper = shallow(<GranuleDetailsMetadata {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsMetadata component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-details-metadata')
    expect(enzymeWrapper.find('h4').props().children).toEqual('Download Metadata:')
  })

  describe('Metadata URL list', () => {
    test('renders the unauthenticated links correctly', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('li > a').length).toEqual(5)
      expect(enzymeWrapper.find('a').at(0).props().href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC')
      expect(enzymeWrapper.find('a').at(0).props().children).toEqual('Native')
      expect(enzymeWrapper.find('a').at(1).props().href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.umm_json')
      expect(enzymeWrapper.find('a').at(1).props().children).toEqual('UMM-G')
      expect(enzymeWrapper.find('a').at(2).props().href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.atom')
      expect(enzymeWrapper.find('a').at(2).props().children).toEqual('ATOM')
      expect(enzymeWrapper.find('a').at(3).props().href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.echo10')
      expect(enzymeWrapper.find('a').at(3).props().children).toEqual('ECHO 10')
      expect(enzymeWrapper.find('a').at(4).props().href).toEqual('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.iso19115')
      expect(enzymeWrapper.find('a').at(4).props().children).toEqual('ISO 19115')
    })

    test('renders the authenticated links correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({ authToken: 'token' })

      const baseUrl = 'http://localhost:3001/concepts/metadata?url='
      const granuleUrl = encodeURIComponent('https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC')
      const tokenUrl = '&token=token'

      expect(enzymeWrapper.find('li > a').length).toEqual(5)
      expect(enzymeWrapper.find('a').at(0).props().href).toEqual(`${baseUrl}${granuleUrl}${tokenUrl}`)
      expect(enzymeWrapper.find('a').at(0).props().children).toEqual('Native')
      expect(enzymeWrapper.find('a').at(1).props().href).toEqual(`${baseUrl}${granuleUrl}.umm_json${tokenUrl}`)
      expect(enzymeWrapper.find('a').at(1).props().children).toEqual('UMM-G')
      expect(enzymeWrapper.find('a').at(2).props().href).toEqual(`${baseUrl}${granuleUrl}.atom${tokenUrl}`)
      expect(enzymeWrapper.find('a').at(2).props().children).toEqual('ATOM')
      expect(enzymeWrapper.find('a').at(3).props().href).toEqual(`${baseUrl}${granuleUrl}.echo10${tokenUrl}`)
      expect(enzymeWrapper.find('a').at(3).props().children).toEqual('ECHO 10')
      expect(enzymeWrapper.find('a').at(4).props().href).toEqual(`${baseUrl}${granuleUrl}.iso19115${tokenUrl}`)
      expect(enzymeWrapper.find('a').at(4).props().children).toEqual('ISO 19115')
    })
  })
})
