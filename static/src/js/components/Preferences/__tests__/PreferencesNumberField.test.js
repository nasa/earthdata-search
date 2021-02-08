import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { FormControl } from 'react-bootstrap'

import PreferencesNumberField from '../PreferencesNumberField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    schema: {
      description: 'Test Field Description'
    },
    name: 'testField',
    formData: 42,
    onChange: jest.fn()
  }

  const enzymeWrapper = shallow(<PreferencesNumberField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PreferencesNumberField component', () => {
  test('renders a input form field', () => {
    const { enzymeWrapper } = setup()

    const input = enzymeWrapper.find(FormControl).first()

    expect(input.props().value).toEqual(42)
    expect(input.props().name).toEqual('testField')
  })

  test('onChange sets the state', () => {
    const { enzymeWrapper } = setup()

    const input = enzymeWrapper.find(FormControl).last()

    input.props().onChange({ target: { value: 0 } })

    expect(enzymeWrapper.state().formData).toEqual(0)
  })
})
