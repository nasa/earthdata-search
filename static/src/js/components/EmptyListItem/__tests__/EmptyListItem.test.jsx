import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaBacon } from 'react-icons/fa'

import EmptyListItem from '../EmptyListItem'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EmptyListItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('EmptyListItem component', () => {
  test('should render the EmptyListItem', () => {
    const { enzymeWrapper } = setup({
      children: 'This is the text'
    })

    expect(enzymeWrapper.find('.empty-list-item').length).toEqual(1)
  })

  test('should render the text', () => {
    const { enzymeWrapper } = setup({
      children: 'This is the text'
    })

    expect(enzymeWrapper.find('.empty-list-item__body').text())
      .toEqual('This is the text')
  })

  test('should render the warning icon by default', () => {
    const { enzymeWrapper } = setup({
      children: 'This is the text'
    })

    expect(enzymeWrapper.find(EDSCIcon).length).toEqual(1)
  })

  test('should render the custom icon', () => {
    const { enzymeWrapper } = setup({
      children: 'This is the text',
      icon: FaBacon
    })

    expect(enzymeWrapper.find(EDSCIcon).props().icon).toEqual(FaBacon)
  })

  test('should add a custom class name', () => {
    const { enzymeWrapper } = setup({
      className: 'custom-class-name',
      children: 'This is the text',
      icon: FaBacon
    })

    expect(enzymeWrapper.props().className).toContain('custom-class-name')
  })
})
