import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCModalContainer from '../EDSCModalContainer'
import { EDSCModal } from '../../../components/EDSCModal/EDSCModal'

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

  const enzymeWrapper = shallow(<EDSCModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCModalContainer component', () => {
  test('should render closed EDSCModal by default', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModal).props().isOpen).toEqual(false)
  })

  test('should render a Modal when open', () => {
    const { enzymeWrapper } = setup({
      isOpen: true
    })

    expect(enzymeWrapper.find(EDSCModal).props().isOpen).toEqual(true)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup({
      isOpen: true,
      title: 'Test Title'
    })

    expect(enzymeWrapper.find(EDSCModal).props().title).toEqual('Test Title')
  })

  test('should render no footer by default', () => {
    const { enzymeWrapper } = setup({
      isOpen: true
    })

    expect(enzymeWrapper.find(EDSCModal).props().footer).toBeNull()
  })

  test('should render a custom footer', () => {
    const { enzymeWrapper } = setup({
      footer: <>Test Footer</>
    })

    expect(enzymeWrapper.find(EDSCModal).props().footer).toEqual(<>Test Footer</>)
  })

  test('onModalExit sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.instance().onModalExit()

    expect(enzymeWrapper.state()).toEqual({ modalOverlay: null })
  })

  test('onSetOverlayModalContent sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.instance().onSetOverlayModalContent('test')

    expect(enzymeWrapper.state()).toEqual({ modalOverlay: 'test' })
  })

  describe('spinner', () => {
    test('should not render spinner by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).props().spinner).toEqual(false)
    })

    test('should render the spinner', () => {
      const { enzymeWrapper } = setup({
        spinner: true
      })

      expect(enzymeWrapper.find(EDSCModal).props().spinner).toEqual(true)
    })
  })

  describe('footerMeta', () => {
    test('should not render footerMeta by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).props().footerMeta).toBeNull()
    })

    test('should render the footer meta information', () => {
      const { enzymeWrapper } = setup({
        footerMeta: 'Footer Meta'
      })

      expect(enzymeWrapper.find(EDSCModal).props().footerMeta).toEqual('Footer Meta')
    })
  })

  describe('innerHeader', () => {
    test('should not render innerHeader by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).props().innerHeaderEl).toBeNull()
    })

    test('should render innerHeader', () => {
      const { enzymeWrapper } = setup({
        innerHeader: <span>Inner Header</span>
      })

      expect(enzymeWrapper.find(EDSCModal).props().innerHeaderEl)
        .toMatchObject(<span>Inner Header</span>)
    })
  })

  describe('primary action', () => {
    test('should not render a primary action by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).props().primaryAction).toBeNull()
    })

    test('should render a primary action when passed', () => {
      const onPrimaryActionMock = jest.fn()
      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock
      })

      expect(enzymeWrapper.find(EDSCModal).props().primaryAction).toEqual('Test')
      expect(enzymeWrapper.find(EDSCModal).props().onPrimaryAction).toEqual(onPrimaryActionMock)
    })

    test('should call onPrimaryAction when clicked', () => {
      const onPrimaryActionMock = jest.fn()
      const { enzymeWrapper } = setup({
        primaryAction: 'Test',
        onPrimaryAction: onPrimaryActionMock
      })

      enzymeWrapper.find(EDSCModal).props().onPrimaryAction()

      expect(onPrimaryActionMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('secondary action', () => {
    test('should not render a secondary action by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).props().secondaryAction).toBeNull()
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

      expect(enzymeWrapper.find(EDSCModal).props().secondaryAction).toEqual('Test')
      expect(enzymeWrapper.find(EDSCModal).props().onSecondaryAction).toEqual(onSecondaryActionMock)
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

      enzymeWrapper.find(EDSCModal).props().onSecondaryAction()

      expect(onSecondaryActionMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the modal is hidden', () => {
    describe('when provided an onClose callback', () => {
      test('should call onClose', () => {
        const onCloseMock = jest.fn()
        const { enzymeWrapper } = setup({
          isOpen: true,
          onClose: onCloseMock
        })

        enzymeWrapper.find(EDSCModal).props().onModalHide()

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

        enzymeWrapper.find(EDSCModal).props().onModalHide()

        expect(onCloseMock).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('bodyPadding', () => {
    describe('when set to its default', () => {
      test('should add the class', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find(EDSCModal).props().modalClassNames).toContain('edsc-modal--body-padding')
      })
    })

    describe('when set to false', () => {
      test('should not add the class', () => {
        const { enzymeWrapper } = setup({
          bodyPadding: false
        })
        expect(enzymeWrapper.find(EDSCModal).props().modalClassNames).not.toContain('edsc-modal--body-padding')
      })
    })
  })
})
