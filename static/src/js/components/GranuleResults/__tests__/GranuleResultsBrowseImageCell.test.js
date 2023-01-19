import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { GranuleResultsBrowseImageCell } from '../GranuleResultsBrowseImageCell'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    row: {
      original: {}
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsBrowseImageCell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GranuleResultsBrowseImageCell component', () => {
  describe('when no image is passed', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.type()).toBe('div')
      expect(enzymeWrapper.children().length).toEqual(0)
    })
  })

  describe('browse flag is false', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup({
        row: {
          original: {
            browseFlag: false,
            granuleThumbnail: 'http://someplace.com/src/image.jpg'
          }
        }
      })

      expect(enzymeWrapper.type()).toBe('div')
      expect(enzymeWrapper.children().length).toEqual(0)
    })
  })

  describe('when given a valid image', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup({
        row: {
          original: {
            browseFlag: true,
            granuleThumbnail: 'http://someplace.com/src/image.jpg'
          }
        }
      })

      expect(enzymeWrapper.type()).toBe('div')
      expect(enzymeWrapper.children().length).toEqual(1)
      expect(enzymeWrapper.childAt(0).props().className).toEqual('granule-results-browse-image-cell__thumb')
      expect(enzymeWrapper.childAt(0).type()).toEqual('div')
      expect(enzymeWrapper.childAt(0).childAt(0).type()).toEqual('img')
      expect(enzymeWrapper.childAt(0).childAt(0).props().src).toEqual('http://someplace.com/src/image.jpg')
    })
  })

  describe('when given a valid image and browse url', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup({
        row: {
          original: {
            browseFlag: true,
            browseUrl: 'http://someplace.com/browse/link',
            granuleThumbnail: 'http://someplace.com/src/image.jpg'
          }
        }
      })

      expect(enzymeWrapper.type()).toBe('div')
      expect(enzymeWrapper.children().length).toEqual(1)
      expect(enzymeWrapper.childAt(0).props().className).toEqual('granule-results-browse-image-cell__thumb')
      expect(enzymeWrapper.childAt(0).type()).toEqual('a')
      expect(enzymeWrapper.childAt(0).props().href).toEqual('http://someplace.com/browse/link')
      expect(enzymeWrapper.childAt(0).childAt(0).type()).toEqual('img')
      expect(enzymeWrapper.childAt(0).childAt(0).props().src).toEqual('http://someplace.com/src/image.jpg')
    })
  })
})
