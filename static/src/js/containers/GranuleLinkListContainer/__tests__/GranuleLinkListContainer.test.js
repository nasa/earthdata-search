import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleLinkListContainer } from '../GranuleLinkListContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: '',
    match: {
      params: {
        id: '1'
      }
    },
    onFetchRetrievalCollection: jest.fn(),
    granuleDownload: {}
  }

  const enzymeWrapper = shallow(<GranuleLinkListContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Granules component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})
