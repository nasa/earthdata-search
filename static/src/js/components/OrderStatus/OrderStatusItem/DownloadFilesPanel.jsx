import React from 'react'
import PropTypes from 'prop-types'
import ProgressBar from 'react-bootstrap/ProgressBar'

import { pluralize } from '../../../util/pluralize'
import { commafy } from '../../../util/commafy'

import TextWindowActions from '../../TextWindowActions/TextWindowActions'

import './DownloadFilesPanel.scss'

/**
 * Renders DownloadFilesPanel.
 * @param {Object} arg0 - The props passed into the component.
 * @param {String} arg0.accessMethodType - The retrieval collection access method.
 * @param {Boolean} arg0.collectionIsCSDA - A flag set when the collection is CSDA.
 * @param {Boolean} arg0.disableEddInProgress - Disables EDD button when a job is still in progress (e.g. a Harmony job still in progress).
 * @param {Array} arg0.downloadLinks - The download links.
 * @param {String} arg0.eddLink - The EDD link.
 * @param {Number} arg0.granuleCount - The retrieval collection granule count.
 * @param {Boolean} arg0.granuleLinksIsLoading - A flag set when the granule links are loading.
 * @param {Boolean} arg0.percentDoneDownloadLinks - Percentage of the download links that have been fetched.
 * @param {String} arg0.retrievalId - The retrieval id.
 * @param {Boolean} arg0.showTextWindowActions - A flag set when the text window actions should be set.
*/
export const DownloadFilesPanel = ({
  accessMethodType,
  collectionIsCSDA = false,
  disableEddInProgress = false,
  downloadLinks,
  eddLink = null,
  granuleCount,
  granuleLinksIsLoading,
  percentDoneDownloadLinks = null,
  retrievalId,
  showTextWindowActions = true
}) => {
  const downloadFileName = `${retrievalId}-${accessMethodType}.txt`

  return downloadLinks.length > 0 ? (
    <>
      <div className="order-status-item__tab-intro">
        <span className="order-status-item__status-text">
          {
            granuleLinksIsLoading
              ? `Retrieving files for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}...`
              : `Retrieved ${commafy(downloadLinks.length)} ${pluralize('file', downloadLinks.length)} for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}`
          }
        </span>
        {
          percentDoneDownloadLinks && (
            <ProgressBar
              now={percentDoneDownloadLinks}
              label={`${percentDoneDownloadLinks}%`}
            />
          )
        }
      </div>
      <TextWindowActions
        clipboardContents={downloadLinks.join('\n')}
        disableCopy={!showTextWindowActions}
        disableEddInProgress={disableEddInProgress}
        disableSave={!showTextWindowActions}
        eddLink={eddLink}
        fileContents={downloadLinks.join('\n')}
        fileName={downloadFileName}
        hideEdd={collectionIsCSDA}
        id={`links-${retrievalId}`}
        modalTitle="Download Files"
      >
        <ul className="download-files-panel__list">
          {
            downloadLinks.map((link, i) => {
              const key = `link_${i}`

              return (
                <li key={key}>
                  <a href={link}>{link}</a>
                </li>
              )
            })
          }
        </ul>
      </TextWindowActions>
    </>
  )
    : (
      <div className="order-status-item__tab-intro">
        The download files will become available once the order has finished processing.
      </div>
    )
}

DownloadFilesPanel.propTypes = {
  accessMethodType: PropTypes.string.isRequired,
  collectionIsCSDA: PropTypes.bool,
  disableEddInProgress: PropTypes.bool,
  downloadLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
  eddLink: PropTypes.string,
  granuleCount: PropTypes.number.isRequired,
  granuleLinksIsLoading: PropTypes.bool.isRequired,
  percentDoneDownloadLinks: PropTypes.string,
  retrievalId: PropTypes.string.isRequired,
  showTextWindowActions: PropTypes.bool
}

export default DownloadFilesPanel
