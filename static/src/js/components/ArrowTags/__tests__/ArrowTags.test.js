import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { ArrowTags } from '../ArrowTags'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    className: 'test-class',
    tags: ['Item 1', 'Item 2', 'Item 3']
  }

  const enzymeWrapper = shallow(<ArrowTags {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ArrowTags component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('ul')
    expect(enzymeWrapper.prop('className')).toBe('arrow-tags test-class')
  })

  test('renders its link correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('li').length).toEqual(3)
    expect(enzymeWrapper.find('li').at(0).text()).toEqual('Item 1')
    expect(enzymeWrapper.find('li').at(0).prop('className')).toEqual('arrow-tags__list-item')
    expect(enzymeWrapper.find('li').at(1).text()).toEqual('Item 2')
    expect(enzymeWrapper.find('li').at(1).prop('className')).toEqual('arrow-tags__list-item')
    expect(enzymeWrapper.find('li').at(2).text()).toEqual('Item 3')
    expect(enzymeWrapper.find('li').at(2).prop('className')).toEqual('arrow-tags__list-item')
  })
})
