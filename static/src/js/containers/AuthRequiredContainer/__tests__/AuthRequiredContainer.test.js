import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as tinyCookie from 'tiny-cookie'
import { AuthRequiredContainer } from '../AuthRequiredContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    children: 'children',
    earthdataEnvironment: 'prod'
  }

  const enzymeWrapper = shallow(<AuthRequiredContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('AuthRequiredContainer component', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.href = href
  })

  test('should redirect if there is no auth cookie', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return null
      return null
    })

    const returnPath = 'http://example.com/test/path'
    delete window.location
    window.location = { href: returnPath }

    const { enzymeWrapper } = setup()

    const div = enzymeWrapper.find('div')
    expect(div.hasClass('route-wrapper')).toEqual(true)

    expect(window.location.href).toEqual(`http://localhost:3000/login?ee=prod&state=${encodeURIComponent(returnPath)}`)
  })

  test('should render children if there is an auth cookie', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return 'token'
      return null
    })

    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.text()).toEqual('children')
  })
})
