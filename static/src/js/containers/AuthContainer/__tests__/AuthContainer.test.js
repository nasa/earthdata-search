import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as tinyCookie from 'tiny-cookie'

import { AuthContainer } from '../AuthContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    children: 'children',
    onUpdateAuth: jest.fn()
  }

  const enzymeWrapper = shallow(<AuthContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('AuthContainer component', () => {
  test('should call onUpdateAuth when mounted', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'auth') return 'token'
      return ''
    })

    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper).toBeDefined()
    expect(props.onUpdateAuth).toHaveBeenCalled()
    expect(props.onUpdateAuth.mock.calls[0]).toEqual(['token'])
  })
})
