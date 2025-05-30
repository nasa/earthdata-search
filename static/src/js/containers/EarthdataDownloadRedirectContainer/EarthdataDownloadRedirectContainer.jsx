import React, { useEffect } from 'react'
import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../../components/Button/Button'
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'
import Spinner from '../../components/Spinner/Spinner'
import useEdscStore from '../../zustand/useEdscStore'

import '../../components/TextWindowActions/TextWindowActions.scss'

export const EarthdataDownloadRedirectContainer = () => {
  const redirect = useEdscStore((state) => state.earthdataDownloadRedirect.redirect)

  useEffect(() => {
    if (redirect) {
      window.location.replace(redirect)
    }
  }, [redirect])

  return (
    <div className="container d-flex flex-column align-items-center text-center">
      <h3 className="font-weight-bolder h5 mt-3 text-center w-75">Opening Earthdata Download to download your files...</h3>
      <div className="text-window-actions__modal-container">
        <EDSCIcon
          className="text-window-actions__modal-icon"
          icon={ArrowLineDiagonal}
          size="36"
        />
      </div>
      <Spinner
        className="mt-4"
        type="dots"
      />
      <div className="mt-4 text-muted text-center text--lg text-window-actions__modal-blurb">
        Click
        {' '}
        <strong className="text-dark">Open Earthdata Download</strong>
        {' '}
        in the dialog presented by your browser.
        If the dialog does not open automatically, click
        {' '}
        <strong className="text-dark">Open Earthdata Download</strong>
        {' '}
        below. You can close this window once your download begins.
      </div>
      <Button
        className="text-window-actions__action text-window-actions__modal action text-window-actions__modal-action--open-edd mt-3"
        bootstrapSize="sm"
        label="Open Earthdata Download"
        icon={ArrowLineDiagonal}
        href={redirect}
        bootstrapVariant="primary"
        iconPosition="right"
        dataTestId="earthdata-download-redirect-button"
      >
        Open Earthdata Download
      </Button>
    </div>
  )
}

export default EarthdataDownloadRedirectContainer
