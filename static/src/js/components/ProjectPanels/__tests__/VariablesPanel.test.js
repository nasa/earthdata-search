import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { VariablesPanel } from '../VariablesPanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    index: 0,
    collectionId: 'collectionId',
    panelHeader: '',
    selectedKeyword: 'Keyword1',
    selectedVariables: [],
    variables: {
      'V123456-EDSC': {
        conceptId: 'V123456-EDSC',
        longName: 'Long Variable Name 1',
        name: 'Variable 1'
      },
      'V987654-EDSC': {
        conceptId: 'V987654-EDSC',
        longName: 'Long Variable Name 2',
        name: 'Variable 2'
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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('displays the selected keyword', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.variables-panel__selected-keyword').text()).toEqual('Keyword1')
  })

  test('clicking All Leafnodes calls onClearSelectedKeyword', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.variables-panel__header').find('Button')
    button.simulate('click')

    expect(props.onClearSelectedKeyword.mock.calls.length).toBe(1)
    expect(props.onClearSelectedKeyword.mock.calls[0]).toEqual(['0.0.1'])
  })

  test('displays the variables list', () => {
    const { enzymeWrapper } = setup()

    const list = enzymeWrapper.find('.variables-panel__list-item')

    expect(list.find('.variables-panel__list-item-name').at(0).text()).toEqual('Variable 1')
    expect(list.find('.variables-panel__list-item-longname').at(0).text()).toEqual('Long Variable Name 1')
    expect(list.find('.variables-panel__list-item-name').at(1).text()).toEqual('Variable 2')
    expect(list.find('.variables-panel__list-item-longname').at(1).text()).toEqual('Long Variable Name 2')
  })

  test('clicking Select All Variables calls onCheckboxChange', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('.variables-panel__list-item-label').at(0).find('.variables-panel__list-item-input')
    checkbox.simulate('change', {
      e: {
        event: 'testEvent'
      }
    })

    expect(props.onCheckboxChange.mock.calls.length).toBe(1)
    expect(props.onCheckboxChange.mock.calls[0]).toEqual([
      {
        e: {
          event: 'testEvent'
        }
      },
      'all',
      'collectionId'
    ])
  })

  test('clicking on a variable calls onCheckboxChange', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('.variables-panel__list-item-input').at(1).find('.variables-panel__list-item-input')
    checkbox.simulate('change', {
      e: {
        event: 'testEvent'
      }
    })

    expect(props.onCheckboxChange.mock.calls.length).toBe(1)
    expect(props.onCheckboxChange.mock.calls[0]).toEqual([
      {
        e: {
          event: 'testEvent'
        }
      },
      'V123456-EDSC',
      'collectionId'
    ])
  })

  test('clicking view details calls onViewDetails', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.variables-panel__list-item-details-link').at(0)
    button.simulate('click')

    expect(props.onViewDetails.mock.calls.length).toBe(1)
    expect(props.onViewDetails.mock.calls[0]).toEqual([{
      conceptId: 'V123456-EDSC',
      longName: 'Long Variable Name 1',
      name: 'Variable 1'
    }, 0])
  })
})
