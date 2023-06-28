import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Button from '../../components/Button/Button'

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

  return (
    <div>
      <h3>Redirecting you to Earthdata Download</h3>
      <p>You can close this window after your download resumes</p>
      <Button
        className="text-window-actions__action text-window-actions__modal action text-window-actions__modal-action--open-edd mt-3"
        bootstrapSize="sm"
        label="Open Earthdata Download"
        icon={FaExternalLinkAlt}
        href={redirect}
        bootstrapVariant="primary"
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
