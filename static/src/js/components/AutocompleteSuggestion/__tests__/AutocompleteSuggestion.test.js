import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import AutocompleteSuggestion from '../AutocompleteSuggestion'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    suggestion: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AutocompleteSuggestion {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AutocompleteSuggestion component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('renders a standard result correctly', () => {
    const { enzymeWrapper } = setup({
      suggestion: {
        type: 'instrument',
        value: 'MODIS'
      }
    })

    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-type').text()).toEqual('Instrument:')
    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-value').text()).toEqual('MODIS')
  })

  test('renders a science keyword result correctly', () => {
    const { enzymeWrapper } = setup({
      suggestion: {
        type: 'science_keywords',
        value: 'Modis Total Pigment Concentration',
        fields: 'Biosphere:Microbiota:Pigments:Modis Total Pigment Concentration'
      }
    })

    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-type').text()).toEqual('Science Keywords:')
    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-value').text()).toEqual('Modis Total Pigment Concentration')

    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-hierarchy span').props().children[0].props.children[0]).toEqual('Biosphere')
    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-hierarchy span').props().children[1].props.children[0]).toEqual('Microbiota')
    expect(enzymeWrapper.find('.autocomplete-suggestion__suggestions-hierarchy span').props().children[2].props.children[0]).toEqual('Pigments')
  })
})
