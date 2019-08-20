import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SecondaryOverlayPanel from '../SecondaryOverlayPanel'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    body: <div className="body-test" />,
    header: <div className="header-test" />,
    footer: <div className="footer-test" />,
    isOpen: true,
    onToggleSecondaryOverlayPanel: jest.fn()
  }

  const enzymeWrapper = shallow(<SecondaryOverlayPanel {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SecondaryOverlayPanel component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('aside')
  })

  test('is passed a body', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.body-test').length).toEqual(1)
  })

  test('is passed a header', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.header-test').length).toEqual(1)
  })

  test('is passed a footer', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer-test').length).toEqual(1)
  })

  describe('Close button', () => {
    test('calls the correct callback', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.secondary-overlay-panel__close-button').prop('onClick')()
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledTimes(1)
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledWith(false)
    })
  })
})
