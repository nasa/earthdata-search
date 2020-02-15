import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleFiltersBody from '../GranuleFiltersBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    granuleFiltersForm: <div className="test" />
  }

  const enzymeWrapper = shallow(<GranuleFiltersBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  describe('Form', () => {
    test('is passed as a child', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('div.test').length).toEqual(1)
    })
  })
})
