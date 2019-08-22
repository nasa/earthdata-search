import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { VariableKeywordPanel } from '../VariableKeywordPanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    accessMethods: {
      opendap: {
        keywordMappings: {
          Keyword1: ['V123456-EDSC'],
          Keyword2: ['V987654-EDSC']
        },
        selectedVariables: [],
        variables: {
          'V123456-EDSC': {
            meta: {},
            umm: {}
          },
          'V987654-EDSC': {
            meta: {},
            umm: {}
          }
        }
      }
    },
    index: 0,
    panelHeader: '',
    selectedAccessMethod: 'opendap',
    onSelectKeyword: jest.fn()
  }

  const enzymeWrapper = shallow(<VariableKeywordPanel {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('VariableKeywordPanel', () => {
  test('displays the list of keywords', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.variable-keyword-panel__list-item').find('Button').at(0).props().children).toEqual('Keyword1')
    expect(enzymeWrapper.find('.variable-keyword-panel__list-item').find('Button').at(1).props().children).toEqual('Keyword2')
  })

  test('displays the number of selected variables per keyword', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.setProps({
      accessMethods: {
        opendap: {
          ...props.accessMethods.opendap,
          selectedVariables: ['V123456-EDSC']
        }
      }
    })

    expect(enzymeWrapper.find('.variable-keyword-panel__selected-count').text()).toEqual('1 selected')
  })

  test('clicking a keyword calls onSelectKeyword', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.variable-keyword-panel__list-item').find('Button').at(0)
    button.simulate('click')

    expect(props.onSelectKeyword.mock.calls.length).toBe(1)
    expect(props.onSelectKeyword.mock.calls[0]).toEqual(['Keyword1', { 'V123456-EDSC': { meta: {}, umm: {} } }, 0])
  })
})
