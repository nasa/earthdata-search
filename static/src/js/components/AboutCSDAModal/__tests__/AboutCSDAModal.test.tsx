import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AboutCSDAModal from '../AboutCSDAModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: AboutCSDAModal,
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.ABOUT_CSDA,
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('AboutCSDAModal component', () => {
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

    expect(screen.getByText("What's the NASA Commercial Smallsat Data Acquisition (CSDA) Program?")).toBeInTheDocument()
  })

  test('should render the body', () => {
    setup()

    expect(screen.getByText(/The Commercial Smallsat Data Acquisition \(CSDA\) Program/)).toBeInTheDocument()
  })

  test('should call setOpenModal when the modal is closed', async () => {
    const { user, zustandState } = setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
  })
})
