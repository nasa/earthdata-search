import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ArrowChevronRight } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../../components/Button/Button'
import Spinner from '../../components/Spinner/Spinner'

import eddIcon from '../../../assets/images/edd-icon-small.png'

export const mapStateToProps = (state) => ({
  earthdataDownloadRedirect: state.earthdataDownloadRedirect
})

export const EarthdataDownloadRedirectContainer = ({
  earthdataDownloadRedirect
}) => {
  const { redirect } = earthdataDownloadRedirect

  useEffect(() => {
    window.location.replace(redirect)
  }, [])

  // TODO we should improve the styling for this
  return (
    <div className="container d-flex flex-column align-items-center text-center">
      <h3 className="font-weight-bolder h5 mt-3 text-center w-75">Opening Earthdata Download to download your files...</h3>
      <img src={eddIcon} alt="earthdata-download" />
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
        icon={ArrowChevronRight}
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

EarthdataDownloadRedirectContainer.propTypes = {
  earthdataDownloadRedirect: PropTypes.shape({
    redirect: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps)(EarthdataDownloadRedirectContainer)
