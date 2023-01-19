import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { AutocompleteDisplayContainer, mapDispatchToProps, mapStateToProps } from '../AutocompleteDisplayContainer'
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

describe('mapDispatchToProps', () => {
  test('onRemoveAutocompleteValue calls actions.removeAutocompleteValue', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeAutocompleteValue')

    mapDispatchToProps(dispatch).onRemoveAutocompleteValue({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      autocomplete: {
        selected: []
      }
    }

    const expectedState = {
      selected: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

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
