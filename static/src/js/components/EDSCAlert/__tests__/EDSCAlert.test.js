import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Alert } from 'react-bootstrap'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCAlert from '../EDSCAlert'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    bootstrapVariant: 'primary',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCAlert {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCAlert component', () => {
  const { enzymeWrapper } = setup()

  test('should render the alert', () => {
    expect(enzymeWrapper.type()).toEqual(Alert)
    expect(enzymeWrapper.prop('className')).toContain('edsc-alert')
  })

  describe('when an class name is provided', () => {
    const { enzymeWrapper } = setup({
      className: 'test-class-name'
    })

    test('should add the class name', () => {
      expect(enzymeWrapper.props().className).toContain('test-class-name')
    })
  })

  describe('when a variant is declared', () => {
    const { enzymeWrapper } = setup({
      variant: 'test-variant'
    })

    test('should add the variant class name', () => {
      expect(enzymeWrapper.prop('className')).toContain('edsc-alert--test-variant')
    })
  })

  describe('when children are provided', () => {
    const { enzymeWrapper } = setup({
      children: <div className="test-child">Test</div>
    })

    test('should render the children', () => {
      expect(enzymeWrapper.find('.test-child').length).toEqual(1)
    })
  })

  describe('when an icon is provided', () => {
    const { enzymeWrapper } = setup({
      icon: FaQuestionCircle
    })

    test('should render the icon', () => {
      expect(enzymeWrapper.find('EDSCIcon').length).toEqual(1)
    })
  })
})
