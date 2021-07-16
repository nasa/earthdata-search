import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from 'react-bootstrap'

import { pluralize } from '../../../util/pluralize'
import { commafy } from '../../../util/commafy'

import TextWindowActions from '../../TextWindowActions/TextWindowActions'

/**
 * Renders DownloadFilesPanel.
 * @param {Object} arg0 - The props passed into the component.
 * @param {String} arg0.accessMethodType - The retrieval collection access method.
 * @param {Array} arg0.downloadLinks - The download links links.
 * @param {String} arg0.retrievalId - The retrieval id.
 * @param {Number} arg0.granuleCount - The retrieval collection granule count.
 * @param {Boolean} arg0.granuleLinksIsLoading - A flag set when the granule links are loading.
 * @param {Boolean} arg0.percentDoneDownloadLinks - Percentage of the download links that have been fetched.
 * @param {Boolean} arg0.showTextWindowActions - A flag set when the text window actions should be set.
*/
export const DownloadFilesPanel = ({
  accessMethodType,
  downloadLinks,
  granuleCount,
  granuleLinksIsLoading,
  percentDoneDownloadLinks,
  retrievalId,
  showTextWindowActions
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
        id={`links-${retrievalId}`}
        fileContents={downloadLinks.join('\n')}
        fileName={downloadFileName}
        clipboardContents={downloadLinks.join('\n')}
        modalTitle="Download Files"
        disableCopy={!showTextWindowActions}
        disableSave={!showTextWindowActions}
      >
        <ul className="download-links-panel__list">
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
        The download files will become available once the order has finished processing
      </div>
    )
}

DownloadFilesPanel.defaultProps = {
  percentDoneDownloadLinks: null,
  showTextWindowActions: true
}

DownloadFilesPanel.propTypes = {
  accessMethodType: PropTypes.string.isRequired,
  downloadLinks: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  retrievalId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number.isRequired,
  granuleLinksIsLoading: PropTypes.bool.isRequired,
  percentDoneDownloadLinks: PropTypes.string,
  showTextWindowActions: PropTypes.bool
}

export default DownloadFilesPanel
