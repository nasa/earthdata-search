import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleFiltersActions from '../GranuleFiltersActions'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    isValid: true,
    onApplyClick: jest.fn(),
    onClearClick: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleFiltersActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersActions component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  describe('Apply button', () => {
    test('renders disabled when isValid is false', () => {
      const { enzymeWrapper } = setup({
        isValid: false
      })

      const button = enzymeWrapper.find('.granule-filters-actions__action--apply')

      expect(button.prop('disabled')).toEqual(true)
    })

    test('calls onApplyClick', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.granule-filters-actions__action--apply')

      button.simulate('click', { event: 'test' })
      expect(props.onApplyClick).toHaveBeenCalledTimes(1)
      expect(props.onApplyClick).toHaveBeenCalledWith({ event: 'test' })
    })
  })

  describe('Clear button', () => {
    test('calls onClearClick', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.granule-filters-actions__action--clear')

      button.simulate('click', { event: 'test' })
      expect(props.onClearClick).toHaveBeenCalledTimes(1)
      expect(props.onClearClick).toHaveBeenCalledWith({ event: 'test' })
    })
  })
})
