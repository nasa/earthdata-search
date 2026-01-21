import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import TooManyPointsModal from '../TooManyPointsModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: TooManyPointsModal,
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.TOO_MANY_POINTS,
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('TooManyPointsModal component', () => {
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

    expect(screen.getByText('Shape file has too many points')).toBeInTheDocument()
  })

  test('should render a message', () => {
    setup()

    expect(screen.getByText('To improve search performance, your shapefile has been simplified. Your original shapefile will be used for spatial subsetting if you choose to enable that setting during download.')).toBeInTheDocument()
  })

  test('should call setOpenModal when the modal is closed', async () => {
    const { user, zustandState } = setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
  })
})
