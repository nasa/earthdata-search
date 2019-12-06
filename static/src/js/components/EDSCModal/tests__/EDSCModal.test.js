import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Modal } from 'react-bootstrap'

import { Button } from '../../Button/Button'
import EDSCModal from '../EDSCModal'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    body: <div className="test-body">Test body content</div>,
    className: 'test-modal',
    size: 'lg',
    id: 'test-identifier',
    isOpen: false,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCModal component', () => {
  test('should render closed Modal by default', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal).props().show).toEqual(false)
  })

  test('should render a Modal when open', () => {
    const { enzymeWrapper } = setup({
      isOpen: true
    })

    expect(enzymeWrapper.find(Modal).props().show).toEqual(true)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup({
      isOpen: true,
      title: 'Test Title'
    })

    expect(enzymeWrapper.find(Modal.Title).text()).toEqual('Test Title')
  })

  test('should render no footer by default', () => {
    const { enzymeWrapper } = setup({
      isOpen: true
    })

    expect(enzymeWrapper.find(Modal.Footer).length).toEqual(0)
  })

  describe('footerMeta', () => {
    test('should not render footerMeta by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.edsc-modal__footer-meta').length).toEqual(0)
    })

    test('should render the footer meta information', () => {
      const { enzymeWrapper } = setup({
        footerMeta: 'Footer Meta'
      })

      expect(enzymeWrapper.find('.edsc-modal__footer-meta').length).toEqual(1)
      expect(enzymeWrapper.find('.edsc-modal__footer-meta').text()).toEqual('Footer Meta')
    })
  })


  describe('primary action', () => {
    test('should not render a primary action by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Button).length).toEqual(0)
    })

    test('should render a primary action when passed', () => {
      const onPrimaryActionMock = jest.fn()
      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock
      })

      expect(enzymeWrapper.find(Button).at(0).props().className).toContain('edsc-modal__action--primary')
    })

    test('should call onPrimaryAction when clicked', () => {
      const onPrimaryActionMock = jest.fn()
      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock
      })

      enzymeWrapper.find(Button).simulate('click')

      expect(enzymeWrapper.find(Button).at(0).props().className).toContain('edsc-modal__action--primary')
      expect(onPrimaryActionMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('secondary action', () => {
    test('should not render a secondary action by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Button).length).toEqual(0)
    })

    test('should not render a without a secondary action', () => {
      const onSecondaryActionMock = jest.fn()
      const { enzymeWrapper } = setup({
        secondaryAction: 'Test',
        onSecondaryAction: onSecondaryActionMock
      })

      expect(enzymeWrapper.find(Button).length).toEqual(0)
    })

    test('should render a primary action when passed', () => {
      const onPrimaryActionMock = jest.fn()
      const onSecondaryActionMock = jest.fn()

      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock,
        secondaryAction: 'Test',
        onSecondaryAction: onSecondaryActionMock
      })

      expect(enzymeWrapper.find(Button).at(0).props().className).toContain('edsc-modal__action--secondary')
    })

    test('should call onSecondaryAction when clicked', () => {
      const onPrimaryActionMock = jest.fn()
      const onSecondaryActionMock = jest.fn()

      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock,
        secondaryAction: 'Test',
        onSecondaryAction: onSecondaryActionMock
      })


      enzymeWrapper.find(Button).at(0).simulate('click')

      expect(enzymeWrapper.find(Button).at(0).props().className).toContain('edsc-modal__action--secondary')
      expect(onSecondaryActionMock).toHaveBeenCalledTimes(1)
    })
  })

  test('should render a custom footer', () => {
    const { enzymeWrapper } = setup({
      footer: <>Test Footer</>
    })

    expect(enzymeWrapper.find(Modal.Footer).props().children.footer.props.children).toEqual('Test Footer')
  })

  describe('when the modal his hidden', () => {
    describe('when provided an onClose callback', () => {
      test('should call onClose', () => {
        const onCloseMock = jest.fn()
        const { enzymeWrapper } = setup({
          isOpen: true,
          onClose: onCloseMock
        })

        enzymeWrapper.find(Modal).props().onHide()

        expect(onCloseMock).toHaveBeenCalledTimes(1)
        expect(onCloseMock).toHaveBeenCalledWith(false)
      })
    })

    describe('when not provided an onClose callback', () => {
      test('should not call onClose', () => {
        const onCloseMock = jest.fn()
        const { enzymeWrapper } = setup({
          isOpen: true
        })

        enzymeWrapper.find(Modal).props().onHide()

        expect(onCloseMock).toHaveBeenCalledTimes(0)
      })
    })
  })
})
