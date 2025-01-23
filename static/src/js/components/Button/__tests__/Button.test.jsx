import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaGlobe } from 'react-icons/fa'

import Button from '../Button'
import Spinner from '../../Spinner/Spinner'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const props = {
    onClick: jest.fn(),
    label: 'Test Label'
  }

  if (type === 'icon') {
    props.icon = FaGlobe
  }

  if (type === 'edsc-icon') {
    props.icon = 'edsc-icon'
  }

  if (type === 'badge') {
    props.badge = 'badge test'
  }

  if (type === 'spinner') {
    props.spinner = true
  }

  if (type === 'icon-right') {
    props.iconPosition = 'right'
    props.icon = FaGlobe
  }

  if (type === 'icon-right-spinner') {
    props.iconPosition = 'right'
    props.icon = FaGlobe
    props.spinner = true
  }

  const enzymeWrapper = mount(<Button {...props}>Button Text</Button>)

  return {
    enzymeWrapper,
    props
  }
}

describe('Button component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
  })

  test('should call onClick if the button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('button')

    button.simulate('click')
    expect(props.onClick.mock.calls.length).toBe(1)
  })

  test('should not render self with an icon when missing an iconClass prop', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('i').length).toEqual(0)
    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
  })

  test('should render self with an icon', () => {
    const { enzymeWrapper } = setup('icon')

    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
    expect(enzymeWrapper.find('EDSCIcon').props().icon).toEqual(FaGlobe)
  })

  test('should render self with an edsc-icon', () => {
    const { enzymeWrapper } = setup('edsc-icon')

    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
    expect(enzymeWrapper.find('i').hasClass('edsc-icon')).toEqual(true)
  })

  test('should render self with a badge', () => {
    const { enzymeWrapper } = setup('badge')
    expect(enzymeWrapper.find('button').find('.badge').text()).toEqual('badge test')
  })

  test('should render self with an aria-label', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('button').prop('aria-label')).toEqual('Test Label')
  })

  test('should render self with an label', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('button').prop('label')).toEqual('Test Label')
  })

  describe('when spinner is true', () => {
    test('should render disabled', () => {
      const { enzymeWrapper } = setup('spinner')
      expect(enzymeWrapper.find('button').prop('label')).toEqual('Test Label')
    })

    test('should render Spinner correctly', () => {
      const { enzymeWrapper } = setup('spinner')
      expect(enzymeWrapper.find(Spinner).prop('size')).toEqual('tiny')
      expect(enzymeWrapper.find(Spinner).prop('inline')).toEqual(true)
      expect(enzymeWrapper.find(Spinner).prop('color')).toEqual('white')
    })
  })

  describe('when positioning the icon to the right', () => {
    test('should render the icon after the text', () => {
      const { enzymeWrapper } = setup('icon-right')
      expect(enzymeWrapper.find('button').childAt(0).type()).toBe('span')
      expect(enzymeWrapper.find('button').childAt(0).text()).toBe('Button Text')
      expect(enzymeWrapper.find('button').childAt(1).type()).toBe(EDSCIcon)
    })

    describe('when the spinner is active', () => {
      test('should not render the icon', () => {
        const { enzymeWrapper } = setup('icon-right-spinner')
        expect(enzymeWrapper.find('button').find(EDSCIcon).length).toBe(0)
      })
    })
  })
})
