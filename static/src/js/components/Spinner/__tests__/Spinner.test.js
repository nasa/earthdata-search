import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Spinner, { Dots } from '../Spinner'

Enzyme.configure({ adapter: new Adapter() })

describe('Spinner component', () => {
  describe('when rendering the "dots" type', () => {
    test('renders correctly', () => {
      const enzymeWrapper = shallow(<Spinner type="dots" />)
      expect(enzymeWrapper).toBeDefined()
    })

    test('sets dots to inline', () => {
      const enzymeWrapper = shallow(<Spinner type="dots" inline />)
      expect(enzymeWrapper.find(Dots).prop('inline')).toEqual(true)
    })

    test('sets dots size', () => {
      const enzymeWrapper = shallow(<Spinner type="dots" size="small" />)
      expect(enzymeWrapper.find(Dots).prop('size')).toEqual('small')
    })

    test('sets dots color', () => {
      const enzymeWrapper = shallow(<Spinner type="dots" color="white" />)
      expect(enzymeWrapper.find(Dots).prop('color')).toEqual('white')
    })

    test('sets the className', () => {
      const enzymeWrapper = shallow(<Dots type="dots" className="test-class" />)
      expect(enzymeWrapper.hasClass('test-class')).toBe(true)
    })
  })
})

describe('Dots component', () => {
  test('renders itself correctly', () => {
    const enzymeWrapper = shallow(<Dots />)
    expect(enzymeWrapper.hasClass('spinner')).toBe(true)
    expect(enzymeWrapper.hasClass('spinner--dots')).toBe(true)
    expect(enzymeWrapper.find('.spinner__inner').length).toEqual(3)
  })

  test('sets dots to inline', () => {
    const enzymeWrapper = shallow(<Dots type="dots" inline />)
    expect(enzymeWrapper.hasClass('spinner--inline')).toBe(true)
  })

  test('sets dots size', () => {
    const enzymeWrapper = shallow(<Dots type="dots" size="small" />)
    expect(enzymeWrapper.hasClass('spinner--small')).toBe(true)
  })

  test('sets dots size', () => {
    const enzymeWrapper = shallow(<Dots type="dots" color="white" />)
    expect(enzymeWrapper.hasClass('spinner--white')).toBe(true)
  })
})
