import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AutocompleteDisplayContainer } from '../AutocompleteDisplayContainer'
import AutocompleteDisplay from '../../../components/AutocompleteDisplay/AutocompleteDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    selected: [{
      type: 'mock_type',
      value: 'mock value'
    }],
    onRemoveAutocompleteValue: jest.fn()
  }

  const enzymeWrapper = shallow(<AutocompleteDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AutocompleteDisplayContainer component', () => {
  test('passes its props and renders a single AutocompleteDisplay component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(AutocompleteDisplay).length).toBe(1)
    expect(enzymeWrapper.find(AutocompleteDisplay).props()).toEqual({
      selected: [{
        type: 'mock_type',
        value: 'mock value'
      }],
      onRemoveAutocompleteValue: props.onRemoveAutocompleteValue
    })
  })
})
