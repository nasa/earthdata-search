import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import {
  FaCopy,
  FaSave,
  FaExpand,
  FaDownload,
  FaExternalLinkAlt
} from 'react-icons/fa'

import { Alert } from 'react-bootstrap'

import { constructDownloadableFile } from '../../util/files/constructDownloadableFile'
import { getOperatingSystem } from '../../util/files/parseUserAgent'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import Spinner from '../Spinner/Spinner'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import Button from '../Button/Button'

import './TextWindowActions.scss'

/**
 * Renders TextWindowActions.
 * @param {Node} children - React children to display in the text window
 * @param {String} clipboardContents - An string that will be copied to the users clipboard.
 * @param {String} fileContents - An optional string to be saved to the users computer.
 * @param {String} fileName - An optional string to to set the name for the file saved to the users computer.
 * @param {String} id - The id to use for the bootstrap modal.
 * @param {String} modalTitle - The title for the modal.
 * @param {Boolean} disableCopy - Disables the copy functionality.
 * @param {Boolean} disableSave - Disables the save functionality.
 */
export const TextWindowActions = ({
  children,
  clipboardContents,
  disableEdd,
  disableCopy,
  disableSave,
  fileContents,
  fileName,
  id,
  modalTitle,
  eddLink
}) => {
  let downloadLink

  const { userAgent } = navigator
  let operatingSystem = getOperatingSystem(userAgent)

  const windowsDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'

  // AppImage extension made the principal as it allows for auto-updates
  const linuxDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.AppImage'

  switch (operatingSystem) {
    case 'macOS': {
      // Apple standard is not to capitalize macOs
      downloadLink = macDownloadLink
      break
    }
    case 'Windows': {
      downloadLink = windowsDownloadLink
      break
    }
    case 'Linux': {
      downloadLink = linuxDownloadLink
      break
    }
    default:
    {
      operatingSystem = 'macOS'
      downloadLink = macDownloadLink
      break
    }
  }

  const { disableEddDownload } = getApplicationConfig()

  const supportsClipboard = document.queryCommandSupported('copy')
  const textareaElRef = useRef(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showEddModal, setShowEddModal] = useState(false)

  const handleLinksModalOpen = () => {
    setShowLinksModal(true)
  }

  const handleLinksModalClose = () => {
    setShowLinksModal(false)
  }

  const handleEddModalOpen = () => {
    setShowEddModal(true)

    // Trigger edd deeplink
    window.location.assign(eddLink)
  }

  const handleEddModalClose = () => {
    setShowEddModal(false)
  }

  const copyToClipboard = () => {
    if (textareaElRef.current) {
      textareaElRef.current.select()
      document.execCommand('copy')
      setCopySuccess(true)
    }
  }

  return (
    <div className="text-window-actions">
      <header className="text-window-actions__actions">
        {
          (!disableEdd && disableEddDownload !== 'true' && eddLink) && (
            <Button
              className="text-window-actions__action text-window-actions__action--edd"
              bootstrapSize="sm"
              bootstrapVariant="success"
              icon={FaDownload}
              onClick={handleEddModalOpen}
              tooltipId={`text-window-actions__tooltip--${id}`}
              tooltip={(
                <span>Download files with Earthdata Download</span>
              )}
            >
              Download Files
            </Button>
          )
        }
        {
          (!disableCopy && supportsClipboard) && (
            <Button
              className="text-window-actions__action text-window-actions__action--copy"
              bootstrapSize="sm"
              icon={FaCopy}
              onClick={copyToClipboard}
              label="Copy"
            >
              Copy
            </Button>
          )
        }
        {
          (!disableSave && (fileContents && fileName)) && (
            <Button
              className="text-window-actions__action text-window-actions__action--save"
              bootstrapSize="sm"
              label="Save"
              icon={FaSave}
              onClick={(e) => {
                constructDownloadableFile(fileContents, fileName)
                e.stopPropagation()
              }}
            >
              Save
            </Button>
          )
        }
        <Button
          className="text-window-actions__action text-window-actions__action--expand"
          bootstrapSize="sm"
          onClick={handleLinksModalOpen}
          label="Expand"
          icon={FaExpand}
        >
          Expand
        </Button>
        {
          copySuccess && (
            <span className="text-window-actions__copied-success">
              Copied!
            </span>
          )
        }
      </header>
      <div className="text-window-actions__body">
        {children}
      </div>
      {
        (!disableCopy && supportsClipboard) && (
          <form
            style={{
              position: 'absolute',
              left: '-99999px',
              height: 0,
              width: 0
            }}
            aria-hidden="true"
          >
            <textarea
              ref={textareaElRef}
              value={clipboardContents}
              readOnly
            />
          </form>
        )
      }
      <EDSCModalContainer
        id={`order-status-links-modal__${id}`}
        className="order-status-links-modal"
        onClose={handleLinksModalClose}
        isOpen={showLinksModal}
        size="lg"
        title={modalTitle}
        body={(
          <>
            {
              !(disableCopy && disableSave) && (
                <header className="text-window-actions__actions">
                  {
                    (!disableCopy && supportsClipboard) && (
                      <Button
                        className="text-window-actions__action text-window-actions__modal action text-window-actions__modal-action--copy"
                        bootstrapSize="sm"
                        icon={FaCopy}
                        onClick={copyToClipboard}
                        label="Copy"
                      >
                        Copy
                      </Button>
                    )
                  }
                  {
                    (!disableSave && (fileContents && fileName)) && (
                      <Button
                        className="text-window-actions__action text-window-actions__modal action text-window-actions__modal-action--save"
                        bootstrapSize="sm"
                        label="Save"
                        icon={FaSave}
                        onClick={(e) => {
                          constructDownloadableFile(fileContents, fileName)
                          e.stopPropagation()
                        }}
                      >
                        Save
                      </Button>
                    )
                  }
                </header>
              )
            }
            <div className={`text-window-actions__modal-body ${disableCopy && disableSave ? 'text-window-actions__modal-body--no-actions' : ''}`}>
              {children}
            </div>
          </>
        )}
      />
      <EDSCModalContainer
        id={`order-status-links-edd-modal__${id}`}
        className="order-status-links-edd-modal"
        onClose={handleEddModalClose}
        isOpen={showEddModal}
        size="md"
        body={(
          <div className="d-flex flex-column align-items-center">
            <h3 className="font-weight-bolder h5 mt-3 text-center w-75">Opening Earthdata Download to download your files...</h3>
            <EDSCIcon
              className="mt-4 text-window-actions__modal-icon"
              icon={FaExternalLinkAlt}
              size="4rem"
            />
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
              below.
            </div>
            <Button
              className="text-window-actions__action text-window-actions__modal action text-window-actions__modal-action--open-edd mt-3"
              bootstrapSize="sm"
              label="Open Earthdata Download"
              icon={FaExternalLinkAlt}
              href={eddLink}
              bootstrapVariant="primary"
            >
              Open Earthdata Download
            </Button>
            <Alert className="mt-3 mb-0 text-center" variant="secondary">
              Don’t have the Earthdata Download installed?
              <br />
              <a
                href={downloadLink}
              >
                Download for
                {' '}
                {operatingSystem}
                {' '}
              </a>
              or
              {' '}
              <a className="link link--external" href="/earthdata-download">learn more.</a>
            </Alert>
          </div>
        )}
      />
    </div>
  )
}

TextWindowActions.defaultProps = {
  children: null,
  disableEdd: false,
  disableCopy: false,
  disableSave: false,
  clipboardContents: '',
  fileContents: null,
  fileName: null,
  id: null,
  modalTitle: null,
  eddLink: null
}

TextWindowActions.propTypes = {
  children: PropTypes.node,
  clipboardContents: PropTypes.string,
  disableEdd: PropTypes.bool,
  disableCopy: PropTypes.bool,
  disableSave: PropTypes.bool,
  fileContents: PropTypes.string,
  fileName: PropTypes.string,
  eddLink: PropTypes.string,
  id: PropTypes.string,
  modalTitle: PropTypes.string
}

export default TextWindowActions
