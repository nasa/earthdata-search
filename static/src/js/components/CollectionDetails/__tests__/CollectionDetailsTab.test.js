import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'

import { CollectionDetailsTab } from '../CollectionDetailsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?some=test-params'
    }
  }

  const enzymeWrapper = shallow(<CollectionDetailsTab {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsTab component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('span')
    expect(enzymeWrapper.prop('className')).toBe('collection-details-tab')
  })

  test('renders its link correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Link).length).toEqual(1)
    expect(enzymeWrapper.find(Link).prop('className')).toEqual('collection-details-tab__button')
    expect(enzymeWrapper.find(Link).prop('to')).toEqual({ pathname: '/search/granules', search: '?some=test-params' })
    expect(enzymeWrapper.find(Link).prop('children')[1]).toEqual(' Back to Granules')
  })
})
