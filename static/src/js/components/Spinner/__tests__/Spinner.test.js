import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Spinner, { Dots } from '../Spinner'

Enzyme.configure({ adapter: new Adapter() })

describe('Spinner component', () => {
  test('when rendering the "dots" type', () => {
    const enzymeWrapper = shallow(<Spinner type="dots" />)
    expect(enzymeWrapper).toBeDefined()
  })
})

describe('Dots component', () => {
  test('renders itself correctly', () => {
    const enzymeWrapper = shallow(<Dots />)
    expect(enzymeWrapper.hasClass('spinner')).toBe(true)
    expect(enzymeWrapper.hasClass('spinner--dots')).toBe(true)
    expect(enzymeWrapper.find('.spinner__inner').length).toEqual(3)
  })
})
