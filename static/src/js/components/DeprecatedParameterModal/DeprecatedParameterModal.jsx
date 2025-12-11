import React from 'react'
import arrayToSentence from 'array-to-sentence'
import Alert from 'react-bootstrap/Alert'

import pluralize from '../../util/pluralize'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import ExternalLink from '../ExternalLink/ExternalLink'

import useEdscStore from '../../zustand/useEdscStore'
import {
  isModalOpen,
  openModalData,
  setOpenModalFunction
} from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

import './DeprecatedParameterModal.scss'

const DeprecatedParameterModal = () => {
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.DEPRECATED_PARAMETER))
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const modalData = useEdscStore(openModalData)
  const { deprecatedUrlParams = [] } = modalData

  if (!isOpen) return null

  const onModalClose = () => {
    setOpenModal(null)
  }

  const body = (
    <>
      <p>
        {
          `Occasionally, we need to make changes to our supported URL parameters.
        We've updated the URL in your browser, so you don't need to do anything.
        If you've used a bookmark to navigate here, consider updating the bookmark
        to use the new URL.`
        }
      </p>
      {
        deprecatedUrlParams.length !== 0 && (
          <Alert
            className="text-center"
            variant="warning"
          >
            {`The following URL ${pluralize('parameter', deprecatedUrlParams.length)} ${deprecatedUrlParams.length > 1 ? 'have' : 'has'} been deprecated: `}
            <span className="font-weight-bold">{arrayToSentence(deprecatedUrlParams)}</span>
          </Alert>
        )
      }
      <p className="mb-0">
        {'Please visit the '}
        <ExternalLink href="https://wiki.earthdata.nasa.gov/display/EDSC/Earthdata+Search+URL+Parameters">
          Earthdata Search URL Parameters
        </ExternalLink>
        {' wiki page for more information on the supported URL parameters.'}
      </p>
    </>
  )

  return (
    <EDSCModalContainer
      id="deprecated-parameter-modal"
      className="deprecated-parameter-modal"
      isOpen={isOpen}
      onClose={onModalClose}
      title="Oops! It looks like you've used an old web address..."
      size="lg"
      body={body}
    />
  )
}

export default DeprecatedParameterModal
