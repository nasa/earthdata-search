import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { TreeItem } from '../TreeItem'

Enzyme.configure({ adapter: new Adapter() })

const defaultItem = {
  children: [{
    children: [],
    checked: true,
    expanded: true,
    fullValue: 'Parent1/Child1',
    isLeaf: true,
    label: 'Child 1',
    level: 2,
    value: 'Child1',
    variable: { mock: 'variable' },
    getKey: jest.fn(),
    getName: jest.fn(),
    setChecked: jest.fn(),
    setExpanded: jest.fn()
  }],
  checked: true,
  expanded: true,
  isParent: true,
  fullValue: 'Parent1',
  label: 'Parent 1',
  level: 1,
  value: 'Parent1',
  getKey: jest.fn(),
  getName: jest.fn(),
  setChecked: jest.fn(),
  setExpanded: jest.fn()
}

function setup(overrideProps) {
  defaultItem.getName.mockReturnValue('Parent 1')

  const props = {
    collectionId: 'collectionId',
    item: {
      ...defaultItem
    },
    index: 0,
    isFirst: true,
    isLast: true,
    onChange: jest.fn(),
    onUpdateSelectedVariables: jest.fn(),
    onViewDetails: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TreeItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('TreeItem component', () => {
  test('renders a checkbox element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).toEqual(1)
    expect(enzymeWrapper.find('input').props().checked).toEqual(true)
    expect(enzymeWrapper.find('input').props().id).toEqual('Parent1')
    expect(enzymeWrapper.find('input').props().value).toEqual('Parent1')

    expect(enzymeWrapper.find('label').props().htmlFor).toEqual('Parent1')
    expect(enzymeWrapper.find('label').text()).toEqual('Parent 1')
  })

  test('renders a child TreeItem', () => {
    const { enzymeWrapper } = setup()

    const treeItem = enzymeWrapper.find(TreeItem)

    expect(treeItem.length).toEqual(1)
    expect(treeItem.props().item).toEqual(expect.objectContaining({
      children: [],
      checked: true,
      expanded: true,
      fullValue: 'Parent1/Child1',
      label: 'Child 1',
      level: 2,
      value: 'Child1'
    }))
  })

  test('checking a checkbox calls setChecked and onChange', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find('input').first().simulate('change', { target: { checked: true } })

    const { item, onChange } = props
    const { setChecked } = item

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })

  test('unchecking a checkbox calls onUpdateSelectedVariables', () => {
    const { enzymeWrapper, props } = setup({
      item: {
        ...defaultItem,
        selectedVariables: ['Parent1']
      }
    })

    enzymeWrapper.find('input').first().simulate('change', { target: { checked: false } })

    const { onUpdateSelectedVariables } = props

    expect(onUpdateSelectedVariables).toHaveBeenCalledTimes(1)
    expect(onUpdateSelectedVariables).toHaveBeenCalledWith([], 'collectionId')
  })

  test('clicking expand/collapse button calls setExpanded', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find('button').simulate('click')

    const { item } = props
    const { setExpanded } = item
    expect(setExpanded).toHaveBeenCalledTimes(1)
    expect(setExpanded).toHaveBeenCalledWith(false)

    // Click the button again
    enzymeWrapper.find('button').simulate('click')

    expect(setExpanded).toHaveBeenCalledTimes(2)
    expect(setExpanded).toHaveBeenLastCalledWith(true)
  })

  test('clicking the info icon calls onViewDetails', () => {
    const { enzymeWrapper, props } = setup({
      item: { ...defaultItem.children[0] }
    })

    enzymeWrapper.find('.tree-item__info-button').simulate('click')

    expect(props.onViewDetails).toHaveBeenCalledTimes(1)
    expect(props.onViewDetails).toHaveBeenCalledWith({ mock: 'variable' }, 0)
  })

  test('adds the level modifier classname', () => {
    const { enzymeWrapper } = setup({ item: { ...defaultItem, level: 2 } })
    expect(enzymeWrapper.props().className).toEqual(expect.stringContaining('tree-item--child-2'))
  })

  describe('when the item is a parent', () => {
    test('adds the modifier classname', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.props().className).toEqual(expect.stringContaining('tree-item--is-parent'))
    })
  })

  describe('when the item is first in the list', () => {
    test('adds the modifier classname', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.props().className).toEqual(expect.stringContaining('tree-item--is-first'))
    })
  })

  describe('when the item is last in the list', () => {
    test('adds the modifier classname', () => {
      const { enzymeWrapper } = setup({
        isFirst: false,
        isLast: true
      })
      expect(enzymeWrapper.props().className).toEqual(expect.stringContaining('tree-item--is-last'))
    })
  })

  describe('when the item is open', () => {
    test('adds the modifier classname', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.props().className).toEqual(expect.stringContaining('tree-item--is-open'))
    })
  })

  describe('when the item is closed', () => {
    test('does not add the modifier classname', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.find('button').simulate('click')
      expect(enzymeWrapper.props().className).not.toEqual(expect.stringContaining('tree-item--is-open'))
    })
  })
})
