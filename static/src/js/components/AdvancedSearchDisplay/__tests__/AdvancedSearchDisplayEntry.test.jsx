import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AdvancedSearchDisplayEntry from '../AdvancedSearchDisplayEntry'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: null,
    ...overrideProps
  }

  const enzymeWrapper = shallow(
    <AdvancedSearchDisplayEntry {...props} />
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('AdvancedSearchDisplayEntry component', () => {
  describe('with children', () => {
    test('should render its children', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.children().length).toBe(0)
    })
  })

  describe('with children', () => {
    test('should render its children', () => {
      const { enzymeWrapper } = setup({
        children: <div className="test-child">Test</div>
      })

      expect(enzymeWrapper.children().length).toBe(1)
      expect(enzymeWrapper.find('.test-child').length).toEqual(1)
    })
  })
})
