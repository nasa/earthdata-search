import { screen } from '@testing-library/react'

import OverrideTemporalModal from '../OverrideTemporalModal'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: OverrideTemporalModal,
  defaultZustandState: {
    query: {
      collection: {
        temporal: {
          endDate: '2019-06-17T23:59:59.999Z',
          startDate: '2015-07-01T06:14:00.000Z'
        }
      },
      changeQuery: vi.fn()
    },
    timeline: {
      query: {
        end: 1548979199999,
        start: 1546300800000
      }
    },
    ui: {
      modals: {
        openModal: MODAL_NAMES.OVERRIDE_TEMPORAL,
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('OverrideTemporalModal component', () => {
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

  describe('when the temporal search is selected', () => {
    test('the callback fires correctly', async () => {
      const { user, zustandState } = setup()

      const button = await screen.findByLabelText('Use Temporal Constraint')
      await user.click(button)

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
        collection: {
          overrideTemporal: {
            endDate: '2019-06-17T23:59:59.999Z',
            startDate: '2015-07-01T06:14:00.000Z'
          }
        }
      })

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })

  describe('when the focused date is selected', () => {
    test('the callback fires correctly', async () => {
      const { user, zustandState } = setup()

      const button = await screen.findByLabelText('Use Focused Time Span')
      await user.click(button)

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
        collection: {
          overrideTemporal: {
            endDate: '2019-01-31T23:59:59.999Z',
            startDate: '2019-01-01T00:00:00.000Z'
          }
        }
      })

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })
})
