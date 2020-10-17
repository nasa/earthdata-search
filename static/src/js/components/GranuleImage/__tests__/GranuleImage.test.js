import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GranuleImage from '../GranuleImage'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    imageSrc: '',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleImage {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleImage component', () => {
  describe('when no image is present', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.type()).toBe(null)
    })
  })

  describe('when an image is present', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup({
        imageSrc: '/some/image/src'
      })

      expect(enzymeWrapper.type()).toBe('div')
    })
  })

  describe('buttons', () => {
    test('when clicking the close button, closes the image', () => {
      const { enzymeWrapper } = setup({
        imageSrc: '/some/image/src'
      })

      expect(enzymeWrapper.state().isOpen).toEqual(true)

      enzymeWrapper.find('.granule-image__button').simulate('click')

      expect(enzymeWrapper.state().isOpen).toEqual(false)
    })

    test('when clicking the open button, closes the image', () => {
      const { enzymeWrapper } = setup({
        imageSrc: '/some/image/src'
      })

      enzymeWrapper.setState({
        isOpen: false
      })

      expect(enzymeWrapper.state().isOpen).toEqual(false)

      enzymeWrapper.find('.granule-image__button').simulate('click')

      expect(enzymeWrapper.state().isOpen).toEqual(true)
    })
  })
})
