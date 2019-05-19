import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'

import { GranuleDetailsTab } from '../GranuleDetailsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onFocusedGranuleChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleDetailsTab {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsTab component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('span')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-tab')
  })

  test('renders its link correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Link).length).toEqual(1)
    expect(enzymeWrapper.find(Link).prop('className')).toEqual('granule-results-tab__button')
    expect(enzymeWrapper.find(Link).prop('to')).toEqual('/search/granules')
    expect(enzymeWrapper.find(Link).prop('children')[1]).toEqual(' Back to Granules')
  })

  describe('onFocusedGranuleChange', () => {
    test('is fired when link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find(Link).simulate('click')

      expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('')
    })
  })
})
