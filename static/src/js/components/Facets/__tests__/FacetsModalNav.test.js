import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import $ from 'jquery'

import FacetsModalNav from '../FacetsModalNav'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const props = {
    activeLetters: [],
    modalInnerRef: {
      current: $('<div><span id="number"></span></div>')
    }
  }

  if (type === 'active') {
    props.activeLetters = [
      '#',
      'A',
      'D',
      'Z'
    ]
  }

  const enzymeWrapper = shallow(<FacetsModalNav {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FacetsModalNav component', () => {
  describe('renders correctly', () => {
    test('when rendering an empty list', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper).toBeDefined()
      expect(enzymeWrapper.hasClass('facets-modal-nav')).toEqual(true)
      expect(enzymeWrapper.text()).toEqual('Jump:')
      expect(enzymeWrapper.find('.facets-modal-nav__list').length).toEqual(0)
    })

    test('when rendering a list with active links', () => {
      const { enzymeWrapper } = setup('active')
      expect(enzymeWrapper).toBeDefined()
      expect(enzymeWrapper.hasClass('facets-modal-nav')).toEqual(true)
      expect(enzymeWrapper.find('.facets-modal-nav__list').length).toEqual(1)
      expect(enzymeWrapper.text()).toEqual('Jump:#ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      expect(enzymeWrapper.find('a.facets-modal-nav__entry').length).toEqual(4)
      expect(enzymeWrapper.find('a.facets-modal-nav__entry').at(0).text()).toEqual('#')
      expect(enzymeWrapper.find('a.facets-modal-nav__entry').at(1).text()).toEqual('A')
      expect(enzymeWrapper.find('a.facets-modal-nav__entry').at(2).text()).toEqual('D')
      expect(enzymeWrapper.find('a.facets-modal-nav__entry').at(3).text()).toEqual('Z')
    })

    describe('when clicking an active list item', () => {
      test('prevents the default link action', () => {
        const { enzymeWrapper } = setup('active')
        const preventDefaultMock = jest.fn()
        const link = enzymeWrapper.find('a.facets-modal-nav__entry').at(0)

        link.simulate('click', { target: $('<a href="#number"></a>')[0], preventDefault: preventDefaultMock })
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        jest.clearAllMocks()
      })

      test('finds the right element to scroll to', () => {
        const { enzymeWrapper } = setup('active')
        const find = jest.spyOn($.fn, 'find')
        const link = enzymeWrapper.find('a.facets-modal-nav__entry').at(0)

        link.simulate('click', { target: $('<a href="#number"></a>')[0], preventDefault: () => { } })
        expect(find).toHaveBeenCalledWith('#number')
        jest.clearAllMocks()
      })

      test('triggers the animate function', () => {
        const { enzymeWrapper } = setup('active')
        const animateMock = jest.spyOn($.fn, 'animate')
        const link = enzymeWrapper.find('a.facets-modal-nav__entry').at(0)

        link.simulate('click', { target: $('<a href="#number"></a>')[0], preventDefault: () => {} })
        expect(animateMock).toHaveBeenCalledTimes(1)
        jest.clearAllMocks()
      })

      test('does not scroll to invalid link', () => {
        const { enzymeWrapper } = setup('active')
        const animateMock = jest.spyOn($.fn, 'animate')
        const link = enzymeWrapper.find('a.facets-modal-nav__entry').at(1)

        link.simulate('click', { target: $('<a href="#nothing"></a>')[0], preventDefault: () => { } })
        expect(animateMock).toHaveBeenCalledTimes(0)
        jest.clearAllMocks()
      })
    })

    describe('when clicking an inactive list item', () => {
      test('does not fire any scroll event', () => {
        const { enzymeWrapper } = setup('active')
        const animateMock = jest.spyOn($.fn, 'animate')
        const span = enzymeWrapper.find('.facets-modal-nav__entry--inactive').at(0)

        span.simulate('click', { target: $('<span></span>')[0], preventDefault: () => { } })
        expect(animateMock).toHaveBeenCalledTimes(0)
        jest.clearAllMocks()
      })
    })
  })
})
