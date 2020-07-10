import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleImageContainer } from '../GranuleImageContainer'
import GranuleImage from '../../../components/GranuleImage/GranuleImage'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          granules: {
            allIds: ['focusedGranule'],
            byId: {
              focusedGranule: {
                browse_flag: true
              }
            }
          }
        }
      }
    },
    focusedCollection: 'collectionId',
    focusedGranule: 'focusedGranule'
  }

  const enzymeWrapper = shallow(<GranuleImageContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleImageContainer component', () => {
  test('passes its props and renders a single GranuleImage component', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleImage).length).toBe(1)
    expect(enzymeWrapper.find(GranuleImage).props().imageSrc).toEqual('http://cmr.example.com/browse-scaler/browse_images/granules/focusedGranule?h=512&w=512')
  })
})
