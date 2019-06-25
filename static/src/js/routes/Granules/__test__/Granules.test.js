import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Granules } from '../Granules'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: '',
    granuleDownloadParams: {}
  }

  const enzymeWrapper = shallow(<Granules {...props} />)

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
