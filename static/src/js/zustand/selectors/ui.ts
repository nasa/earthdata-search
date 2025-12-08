import { ModalName } from '../../constants/modalNames'
import { EdscStore } from '../types'

/**
 * The setOpenModal function selector
 */
export const setOpenModalFunction = (state: EdscStore) => state.ui.modals.setOpenModal

/**
 * Retrieves the modalData for the currently open modal
 */
export const openModalData = (state: EdscStore) => state.ui.modals.modalData || {}

/**
 * Determines if the provided modalName is currently open
 * @param {object} state The current Zustand store
 * @param {string} modalName The name of the modal to check
 * @returns {boolean}
 */
export const isModalOpen = (
  state: EdscStore,
  modalName: ModalName
) => state.ui.modals.openModal === modalName
