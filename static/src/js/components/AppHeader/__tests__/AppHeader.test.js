import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AppHeader from '../AppHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {}
  const enzymeWrapper = shallow(<AppHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('AppHeader component', () => {
  test('should render the site AppHeader', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.app-header').length).toEqual(1)
  })
})
