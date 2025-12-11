import { MODAL_NAMES } from '../../../constants/modalNames'
import useEdscStore from '../../useEdscStore'

import {
  isModalOpen,
  openModalData,
  setOpenModalFunction
} from '../ui'

jest.mock('../../../store/configureStore', () => jest.fn())

describe('ui selectors', () => {
  describe('setOpenModalFunction', () => {
    test('returns the setOpenModal function', () => {
      const mockSetOpenModal = jest.fn()
      useEdscStore.setState((state) => {
        state.ui.modals.setOpenModal = mockSetOpenModal
      })

      const setOpenModal = setOpenModalFunction(useEdscStore.getState())
      expect(setOpenModal).toEqual(mockSetOpenModal)
    })
  })

  describe('openModalData', () => {
    test('returns the modalData', () => {
      useEdscStore.setState((state) => {
        state.ui.modals.modalData = { deprecatedUrlParams: [] }
      })

      const modalData = openModalData(useEdscStore.getState())
      expect(modalData).toEqual({ deprecatedUrlParams: [] })
    })

    test('returns an empty object if no modalData is set', () => {
      const modalData = openModalData(useEdscStore.getState())
      expect(modalData).toEqual({})
    })
  })

  describe('isModalOpen', () => {
    test('returns true if the modal is open', () => {
      useEdscStore.setState((state) => {
        state.ui.modals.openModal = MODAL_NAMES.ABOUT_CSDA
      })

      const isOpen = isModalOpen(useEdscStore.getState(), MODAL_NAMES.ABOUT_CSDA)
      expect(isOpen).toBe(true)
    })

    test('returns false if the modal is not open', () => {
      const isOpen = isModalOpen(useEdscStore.getState(), MODAL_NAMES.ABOUT_CSDA)
      expect(isOpen).toBe(false)
    })
  })
})
