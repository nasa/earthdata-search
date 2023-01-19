import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FormControl } from 'react-bootstrap'

import PreferencesMultiSelectField from '../PreferencesMultiSelectField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    schema: {
      items: {
        enum: ['option1', 'option2'],
        enumNames: ['Option 1', 'Option 2'],
        description: 'Test Field Description'
      }
    },
    name: 'testField',
    formData: ['option1'],
    onChange: jest.fn()
  }

  const enzymeWrapper = shallow(<PreferencesMultiSelectField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PreferencesMultiSelectField component', () => {
  test('renders a radio form field', () => {
    const { enzymeWrapper } = setup()

    const input = enzymeWrapper.find(FormControl)

    expect(input.props().value).toEqual(['option1'])
    expect(input.props().name).toEqual('testField')
    expect(input.props().label).toEqual('testField')
  })

  test('onChange sets the state', () => {
    const { enzymeWrapper } = setup()

    const input = enzymeWrapper.find(FormControl)

    input.props().onChange({ target: { selectedOptions: [{ value: 'option2' }] } })

    expect(enzymeWrapper.state().formData).toEqual(['option2'])
  })
})
