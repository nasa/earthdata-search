import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
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

  describe('onChange', () => {
    test('onChange calls props onChange', () => {
      const { enzymeWrapper, props } = setup()

      const input = enzymeWrapper.find(FormControl).last()

      input.invoke('onChange')({ target: { value: '42' } })

      enzymeWrapper.update()

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(42)
    })

    test('returns an integer 0 when the input is "0"', () => {
      const { enzymeWrapper, props } = setup()

      const input = enzymeWrapper.find(FormControl).last()

      input.props().onChange({ target: { value: '0' } })

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(0)
    })

    test('returns a number 0.1 when the input is ".1"', () => {
      const { enzymeWrapper, props } = setup()

      const input = enzymeWrapper.find(FormControl).last()

      input.props().onChange({ target: { value: '.1' } })

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(0.1)
    })

    test('returns a number -42 when the input is "-42"', () => {
      const { enzymeWrapper, props } = setup()

      const input = enzymeWrapper.find(FormControl).last()

      input.props().onChange({ target: { value: '-42' } })

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(-42)
    })
  })
})
