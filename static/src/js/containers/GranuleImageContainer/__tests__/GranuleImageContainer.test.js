import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

import { GranuleImageContainer, mapStateToProps } from '../GranuleImageContainer'
import GranuleImage from '../../../components/GranuleImage/GranuleImage'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    earthdataEnvironment: 'prod',
    focusedGranuleId: 'focusedGranule',
    granuleMetadata: {
      browseFlag: true
    }
  }

  const enzymeWrapper = shallow(<GranuleImageContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      earthdataEnvironment: 'prod',
      focusedGranule: 'granuleId',
      metadata: {
        granules: {}
      }
    }

    const expectedState = {
      earthdataEnvironment: 'prod',
      focusedGranuleId: 'granuleId',
      granuleMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleImageContainer component', () => {
  test('passes its props and renders a single GranuleImage component', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleImage).length).toBe(1)
    expect(enzymeWrapper.find(GranuleImage).props().imageSrc).toEqual('http://cmr.example.com/browse-scaler/browse_images/granules/focusedGranule?h=512&w=512')
  })
})
