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
  describe('when passed granule metadata', () => {
    test('passes its props and renders a single GranuleResultsBody component', () => {
      const { enzymeWrapper } = setup({
        authToken: '',
        earthdataEnvironment: 'prod',
        granuleMetadata: {
          metadataUrls: {
            atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom'
          }
        }
      })

      expect(enzymeWrapper.find(GranuleDetailsBody).length).toBe(1)
      expect(enzymeWrapper.find(GranuleDetailsBody).props().authToken).toEqual('')
      expect(enzymeWrapper.find(GranuleDetailsBody).props().granuleMetadata).toEqual({
        metadataUrls: {
          atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom'
        }
      })
    })
  })
})
