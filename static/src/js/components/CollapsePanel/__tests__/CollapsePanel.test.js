import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { CollapsePanel } from '../CollapsePanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    buttonClassName: 'test-button-class',
    className: 'test-wrap-class',
    children: <div className="test-child-wrap">Im a child!</div>,
    header: 'test-header-text',
    panelClassName: 'test-panel-class',
    scrollToBottom: false
  }

  const enzymeWrapper = shallow(<CollapsePanel {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollapsePanel component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('collapse-panel test-wrap-class')
  })

  test('renders its button correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.instance().onToggleClick = jest.fn()
    const button = enzymeWrapper.find('button')
    expect(button.length).toEqual(1)
    expect(button.text()).toEqual('test-header-text<EDSCIcon />')
  })

  test('toggles when clicked', () => {
    const { enzymeWrapper } = setup()
    const button = enzymeWrapper.find('button')
    expect(enzymeWrapper.state('open')).toEqual(false)
    expect(enzymeWrapper.find('EDSCIcon').prop('icon')).toEqual(FaChevronDown)
    button.simulate('click')
    expect(enzymeWrapper.state('open')).toEqual(true)
    expect(enzymeWrapper.find('EDSCIcon').prop('icon')).toEqual(FaChevronUp)
  })

  test('renders it children correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('#collapse-text').text()).toBe('Im a child!')
  })
})
