import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { VariablesPanel } from '../VariablesPanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    index: 0,
    panelHeader: '',
    selectedKeyword: 'Keyword1',
    selectedVariables: [],
    variables: {
      'V123456-EDSC': {
        meta: {
          'concept-id': 'V123456-EDSC'
        },
        umm: {
          LongName: 'Long Variable Name 1',
          Name: 'Variable 1'
        }
      },
      'V987654-EDSC': {
        meta: {
          'concept-id': 'V987654-EDSC'
        },
        umm: {
          LongName: 'Long Variable Name 2',
          Name: 'Variable 2'
        }
      }
    },
    onCheckboxChange: jest.fn(),
    onClearSelectedKeyword: jest.fn(),
    onViewDetails: jest.fn()
  }

  const enzymeWrapper = shallow(<VariablesPanel {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('VariablesPanel', () => {
  test('displays the selected keyword', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.selected-keyword strong').text()).toEqual('Keyword1')
  })

  test('clicking All Leafnodes calls onClearSelectedKeyword', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.selected-keyword').find('Button')
    button.simulate('click')

    expect(props.onClearSelectedKeyword.mock.calls.length).toBe(1)
    expect(props.onClearSelectedKeyword.mock.calls[0]).toEqual(['0.0.1'])
  })

  test('displays the variables list', () => {
    const { enzymeWrapper } = setup()

    const list = enzymeWrapper.find('.collection-variables')

    expect(list.find('.collection-variable-name').at(0).text()).toEqual('Variable 1')
    expect(list.find('.collection-variable-longname').at(0).text()).toEqual('Long Variable Name 1')
    expect(list.find('.collection-variable-name').at(1).text()).toEqual('Variable 2')
    expect(list.find('.collection-variable-longname').at(1).text()).toEqual('Long Variable Name 2')
  })

  test('clicking Select All Variables calls onCheckboxChange', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('.collection-variable-list-item-label').find('.select-all')
    checkbox.simulate('change')

    expect(props.onCheckboxChange.mock.calls.length).toBe(1)
    expect(props.onCheckboxChange.mock.calls[0]).toEqual(['all'])
  })

  test('clicking on a variable calls onCheckboxChange', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('.collection-variable-list-item-input').at(0)
    checkbox.simulate('change')

    expect(props.onCheckboxChange.mock.calls.length).toBe(1)
    expect(props.onCheckboxChange.mock.calls[0]).toEqual(['V123456-EDSC'])
  })

  test('clicking view details calls onViewDetails', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.collection-variable-details-link').at(0)
    button.simulate('click')

    expect(props.onViewDetails.mock.calls.length).toBe(1)
    expect(props.onViewDetails.mock.calls[0]).toEqual([{
      meta: {
        'concept-id': 'V123456-EDSC'
      },
      umm: {
        LongName: 'Long Variable Name 1',
        Name: 'Variable 1'
      }
    }, 0])
  })
})
