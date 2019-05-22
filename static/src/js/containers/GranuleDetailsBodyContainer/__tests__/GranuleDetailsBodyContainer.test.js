import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleDetailsBodyContainer } from '../GranuleDetailsBodyContainer'
import GranuleDetailsBody from '../../../components/GranuleDetails/GranuleDetailsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<GranuleDetailsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsBodyContainer component', () => {
  describe('with no granule metadata', () => {
    test('returns null', () => {
      const { enzymeWrapper } = setup({
        authToken: '',
        granules: {
          allIds: [],
          byId: {}
        },
        focusedGranule: ''
      })
      expect(enzymeWrapper.type()).toEqual(null)
    })
  })

  describe('when passed granule metadata', () => {
    test('passes its props and renders a single GranuleResultsBody component', () => {
      const { enzymeWrapper } = setup({
        authToken: '',
        granules: {
          allIds: ['focusedGranule'],
          byId: {
            focusedGranule: {
              json: {
                Granule: {}
              },
              metadataUrls: {
                atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom'
              },
              xml: '<Granule><Granule>'
            }
          }
        },
        focusedGranule: 'focusedGranule'
      })

      expect(enzymeWrapper.find(GranuleDetailsBody).length).toBe(1)
      expect(enzymeWrapper.find(GranuleDetailsBody).props().authToken).toEqual('')
      expect(enzymeWrapper.find(GranuleDetailsBody).props().json).toEqual({ Granule: {} })
      expect(enzymeWrapper.find(GranuleDetailsBody).props().metadataUrls).toEqual({ atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom' })
      expect(enzymeWrapper.find(GranuleDetailsBody).props().xml).toEqual('<Granule><Granule>')
    })
  })
})
