import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../jestConfigs/getByTextWithMarkup'

import KeyboardShortcutsModal, { keyboardShortcutsList } from '../KeyboardShortcutsModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: KeyboardShortcutsModal,
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.KEYBOARD_SHORTCUTS,
        setOpenModal: jest.fn()
      }
    }
  }
})

describe('KeyboardShortcutsModal component', () => {
  test('does not render when modal is closed', () => {
    setup({
      overrideZustandState: {
        ui: {
          modals: {
            openModal: null
          }
        }
      }
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('should render a Modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup()

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
  })

  test('should render the keyboard shortcuts list', () => {
    setup()

    Object.keys(keyboardShortcutsList).forEach((key) => {
      const value = keyboardShortcutsList[key]

      const element = getByTextWithMarkup(`${key}:${value}`)
      expect(element).toBeInTheDocument()
    })
  })
})

describe('KeyboardShortcutsModal actions', () => {
  describe('when the user presses the ? key while the modal is not open', () => {
    test('the modal opens', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          ui: {
            modals: {
              openModal: null
            }
          }
        }
      })

      await user.keyboard('?')

      await waitFor(() => {
        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(
        MODAL_NAMES.KEYBOARD_SHORTCUTS
      )
    })

    describe('when the user presses the ? key while the modal is open', () => {
      test('the modal opens', async () => {
        const { user, zustandState } = setup()

        await user.keyboard('?')

        await waitFor(() => {
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
        })

        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
      })
    })

    describe('when the clicking the close button on the modal', () => {
      test('calls the `setOpenModal` function with null', async () => {
        const { user, zustandState } = setup()

        const closeButton = screen.getByRole('button')
        await user.click(closeButton)

        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
      })
    })
  })
})
