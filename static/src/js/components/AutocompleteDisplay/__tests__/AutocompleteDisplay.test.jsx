import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import AutocompleteDisplay from '../AutocompleteDisplay'
import { Button } from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    selected: [],
    onRemoveAutocompleteValue: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = mount(<AutocompleteDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AutocompleteDisplay component', () => {
  describe('with no props', () => {
    test('should render self', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper).toBeDefined()
      expect(enzymeWrapper.type()).toBe(AutocompleteDisplay)
    })

    test('should render self without display', () => {
      const props = {
        selected: [],
        onRemoveAutocompleteValue: jest.fn()
      }

      const shallowEnzymeWrapper = shallow(<AutocompleteDisplay {...props} />).type()

      expect(shallowEnzymeWrapper).toBe(null)
    })
  })

  describe('with selected', () => {
    test('should render the selected suggestion correctly without a hierarchy', () => {
      const { enzymeWrapper } = setup({
        selected: [{
          type: 'instrument',
          value: 'MODIS'
        }]
      })

      expect(enzymeWrapper.find('.autocomplete-display__type').text()).toEqual('Inst.')
      expect(enzymeWrapper.find('.autocomplete-display__value').text()).toEqual('MODIS')
    })

    test('should render the selected suggestion correctly with a hierarchy', () => {
      const { enzymeWrapper } = setup({
        selected: [{
          type: 'instrument',
          field: 'KEYWORD:MODIS',
          value: 'MODIS'
        }]
      })

      expect(enzymeWrapper.find('.autocomplete-display__type').text()).toEqual('Inst.')
      expect(enzymeWrapper.find('.autocomplete-display__value').text()).toEqual('MODIS')
    })
  })

  describe('#onRemoveAutocompleteValue', () => {
    test('clicking the remove button calls onRemoveAutocompleteValue', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        selected: [{
          type: 'mock_type',
          value: 'mock value'
        }]
      })

      const button = enzymeWrapper.find(Button)

      button.simulate('click')

      expect(props.onRemoveAutocompleteValue).toHaveBeenCalledTimes(1)
    })
  })
})
