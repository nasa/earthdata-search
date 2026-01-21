import React from 'react'
import { act, screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCModalContainer from '../EDSCModalContainer'
import EDSCModal from '../../../components/EDSCModal/EDSCModal'

// Mock the EDSCModal component but keep the actual implementation
vi.mock('../../../components/EDSCModal/EDSCModal', async () => {
  const ActualEDSCModal = (await vi.importActual('../../../components/EDSCModal/EDSCModal')).default

  return {
    __esModule: true,
    default: vi.fn((props) => <ActualEDSCModal {...props} />)
  }
})

const setup = setupTest({
  Component: EDSCModalContainer,
  defaultProps: {
    body: <div className="test-body">Test body content</div>,
    className: 'test-modal',
    size: 'lg',
    id: 'test-identifier',
    isOpen: true
  }
})

describe('EDSCModalContainer', () => {
  test('renders an EDSCModal', () => {
    setup()

    expect(EDSCModal).toHaveBeenCalledTimes(1)
    expect(EDSCModal).toHaveBeenCalledWith({
      activeModalOverlay: null,
      bodyEl: <div className="test-body">Test body content</div>,
      footer: null,
      footerMeta: null,
      identifier: 'edsc-modal__test-identifier-modal',
      innerHeaderEl: null,
      isOpen: true,
      modalClassNames: 'edsc-modal edsc-modal__test-identifier-modal test-modal edsc-modal--body-padding',
      modalInner: { current: expect.any(HTMLDivElement) },
      modalOverlayEl: null,
      onModalExit: expect.any(Function),
      onModalHide: expect.any(Function),
      onPrimaryAction: null,
      onSecondaryAction: null,
      primaryAction: null,
      primaryActionDisabled: false,
      primaryActionLoading: false,
      secondaryAction: null,
      size: 'lg',
      spinner: false,
      subtitle: '',
      title: null
    }, {})
  })

  test('applies classnames correctly when provided', () => {
    setup({
      overrideProps: {
        className: 'custom-class another-class',
        fixedHeight: '400px',
        innerHeader: <div>Test Header</div>,
        bodyPadding: true
      }
    })

    expect(EDSCModal).toHaveBeenCalledWith(expect.objectContaining({
      modalClassNames: 'edsc-modal edsc-modal__test-identifier-modal custom-class another-class edsc-modal--fixed-height-400px edsc-modal--fixed-height edsc-modal--inner-header edsc-modal--body-padding'
    }), {})
  })

  describe('when closing the modal', () => {
    test('calls the onClose callback when provided', async () => {
      const { props, user } = setup({
        overrideProps: {
          onClose: vi.fn()
        }
      })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(props.onClose).toHaveBeenCalledTimes(1)
      expect(props.onClose).toHaveBeenCalledWith(false)
    })
  })

  describe('when a component is passed as the modal body', () => {
    test('passes the setModalOverlay function to the component', () => {
      const ModalBodyComponent = vi.fn(() => <div>Test</div>)

      setup({
        overrideProps: {
          body: <ModalBodyComponent />
        }
      })

      expect(ModalBodyComponent).toHaveBeenCalledTimes(1)
      expect(ModalBodyComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          setModalOverlay: expect.any(Function)
        }),
        {}
      )
    })

    describe('when the setModalOverlay function is called', () => {
      test('sets the activeModalOverlay', async () => {
        const ModalBodyComponent = vi.fn(() => <div>Test</div>)
        const ModalOverlay = () => <div className="overlay-content">Overlay Content</div>

        setup({
          overrideProps: {
            body: <ModalBodyComponent />,
            modalOverlays: {
              testOverlay: <ModalOverlay />
            }
          }
        })

        const { setModalOverlay } = ModalBodyComponent.mock.calls[0][0]

        vi.clearAllMocks()

        await act(() => {
          setModalOverlay('testOverlay')
        })

        expect(EDSCModal).toHaveBeenCalledTimes(1)
        expect(EDSCModal).toHaveBeenCalledWith(expect.objectContaining({
          activeModalOverlay: <ModalOverlay />
        }), {})
      })

      describe('when onModalExit is called', () => {
        test('clears the activeModalOverlay', async () => {
          const ModalBodyComponent = vi.fn(() => <div>Test</div>)
          const ModalOverlay = () => <div className="overlay-content">Overlay Content</div>

          setup({
            overrideProps: {
              body: <ModalBodyComponent />,
              modalOverlays: {
                testOverlay: <ModalOverlay />
              }
            }
          })

          const { setModalOverlay } = ModalBodyComponent.mock.calls[0][0]

          // Set the overlay first
          await act(() => {
            setModalOverlay('testOverlay')
          })

          // Now call onModalExit to clear it
          const { onModalExit } = EDSCModal.mock.calls[0][0]

          vi.clearAllMocks()

          await act(() => {
            onModalExit()
          })

          expect(EDSCModal).toHaveBeenCalledTimes(1)
          expect(EDSCModal).toHaveBeenCalledWith(expect.objectContaining({
            activeModalOverlay: null
          }), {})
        })
      })
    })
  })
})
