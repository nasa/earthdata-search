import React from 'react'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'

import './TooManyPointsModal.scss'

const TooManyPointsModal = () => {
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.TOO_MANY_POINTS))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  if (!isOpen) return null

  const onModalClose = () => {
    setOpenModal(null)
  }

  const body = (
    <p>
      To improve search performance, your shapefile has been simplified.
      Your original shapefile will be used for spatial subsetting if you
      choose to enable that setting during download.
    </p>
  )

  return (
    <EDSCModalContainer
      className="too-many-points"
      title="Shape file has too many points"
      isOpen={isOpen}
      id="too-many-points"
      size="md"
      onClose={onModalClose}
      body={body}
    />
  )
}

export default TooManyPointsModal
