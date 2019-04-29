import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'

import { GranuleResultsTab } from '../GranuleResultsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsTab {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsTab component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('span')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-tab')
  })

  test('renders its link correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Link).length).toEqual(1)
    expect(enzymeWrapper.find(Link).prop('className')).toEqual('granule-results-tab__button')
    expect(enzymeWrapper.find(Link).prop('to')).toEqual('/')
    expect(enzymeWrapper.find(Link).prop('children')[1]).toEqual(' Back to Collections')
  })

  describe('onFocusedCollectionChange', () => {
    test('is fired when link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find(Link).simulate('click')

      expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
    })
  })
})
