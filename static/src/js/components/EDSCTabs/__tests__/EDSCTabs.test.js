import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Tabs } from 'react-bootstrap'
import EDSCTabs from '../EDSCTabs'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: [],
    ...overrideProps
  }
  const enzymeWrapper = shallow(<EDSCTabs {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('EDSCTabs component', () => {
  const { enzymeWrapper } = setup({
    children: [
      'Test children'
    ]
  })

  const tabs = enzymeWrapper.find(Tabs)

  test('should have the correct classname', () => {
    expect(enzymeWrapper.find('.edsc-tabs').length).toEqual(1)
  })

  test('should render the tabs', () => {
    expect(tabs.length).toEqual(1)
  })

  test('should render its children', () => {
    expect(enzymeWrapper.find('.edsc-tabs').type()).toEqual('div')
  })

  describe('when a classname is provided', () => {
    const { enzymeWrapper } = setup({
      children: [
        'Test children'
      ],
      className: 'test-classname'
    })

    test('should add the classname', () => {
      expect(enzymeWrapper.find('.edsc-tabs').props().className).toContain('test-classname')
    })
  })

  describe('when no children are provided', () => {
    const { enzymeWrapper } = setup({
      children: []
    })

    test('should do nothing', () => {
      expect(enzymeWrapper.find('.edsc-tabs').length).toEqual(0)
    })
  })

  describe('when falsy are provided', () => {
    const { enzymeWrapper } = setup({
      children: [
        'Test children',
        false
      ]
    })

    const tabs = enzymeWrapper.find(Tabs)

    test('should filter falsy children', () => {
      expect(tabs.length).toEqual(1)
    })
  })

  describe('when padding is set to false', () => {
    const { enzymeWrapper } = setup({
      padding: false,
      children: [
        'Test children'
      ]
    })

    test('should add the class', () => {
      expect(enzymeWrapper.find('.edsc-tabs').props().className).toContain('edsc-tabs--no-padding')
    })
  })
})
