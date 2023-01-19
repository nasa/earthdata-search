import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon'

Enzyme.configure({ adapter: new Adapter() })

describe('EDSCIcon component', () => {
  test('should render an icon', () => {
    const enzymeWrapper = mount(<EDSCIcon icon={FaQuestionCircle} />)

    expect(enzymeWrapper.type()).toEqual(EDSCIcon)
    expect(enzymeWrapper.prop('icon')).toEqual(FaQuestionCircle)
  })

  describe('when classes are supplied', () => {
    test('should add the class name', () => {
      const enzymeWrapper = mount(<EDSCIcon icon={FaQuestionCircle} className="test-class" />)
      expect(enzymeWrapper.prop('className')).toContain('test-class')
    })
  })

  describe('when children are provided', () => {
    test('should render the children', () => {
      const enzymeWrapper = shallow(<EDSCIcon icon={FaQuestionCircle}><div className="test-child">Test</div></EDSCIcon>)
      expect(enzymeWrapper.find('.test-child').length).toEqual(1)
    })
  })

  describe('when an icon is not found', () => {
    test('should not render the icon', () => {
      const enzymeWrapper = shallow(<EDSCIcon icon="noIcon" />)
      expect(enzymeWrapper.find('EDSCIcon').length).toEqual(0)
    })
  })
})
