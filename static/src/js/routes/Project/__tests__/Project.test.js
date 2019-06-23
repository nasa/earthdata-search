import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Project } from '../Project'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {},
    onMasterOverlayHeightChange: jest.fn(),
    onSubmitOrder: jest.fn()
  }

  const enzymeWrapper = shallow(<Project {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Project component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('handleSubmit calls onSubmitOrder', () => {
    const { enzymeWrapper, props } = setup()

    const form = enzymeWrapper.find('form')

    form.simulate('submit', { preventDefault: jest.fn() })
    expect(props.onSubmitOrder.mock.calls.length).toBe(1)
  })
})
