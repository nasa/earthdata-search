import React from 'react'
import PropTypes from 'prop-types'

import { generateDownloadScript } from '../../../util/files/generateDownloadScript'
import { pluralize } from '../../../util/pluralize'
import { commafy } from '../../../util/commafy'

import TextWindowActions from '../../TextWindowActions/TextWindowActions'

/**
 * Renders DownloadScriptPanel.
 * @param {Object} arg0 - The props passed into the component.
 * @param {String} arg0.accessMethodType - The retrieval collection access method.
 * @param {String} arg0.earthdataEnvironment - The current environment.
 * @param {Array} arg0.downloadLinks - The download links.
 * @param {Object} arg0.retrievalCollection - The retrieval collection metadata.
 * @param {String} arg0.retrievalId - The retrieval id.
 * @param {Number} arg0.granuleCount - The retrieval collection granule count.
 * @param {Boolean} arg0.granuleLinksIsLoading - A flag set when the granule links are loading.
*/
export const DownloadScriptPanel = ({
  accessMethodType,
  earthdataEnvironment,
  downloadLinks,
  retrievalCollection,
  retrievalId,
  granuleCount,
  granuleLinksIsLoading
}) => {
  const downloadFileName = `${retrievalId}-${accessMethodType}.sh`

  return downloadLinks.length > 0
    ? (
      <>
        <div className="order-status-item__tab-intro">
          <p className="collection-download-display__intro mt-2">
            <strong>Linux: </strong>
            { 'You must first make the script an executable by running the line \'chmod 777 download.sh\' from the command line. After that is complete, the file can be executed by typing \'./download.sh\'. ' }
            { 'For a detailed walk through of this process, please reference this ' }
            <a href="https://wiki.earthdata.nasa.gov/display/EDSC/How+To%3A+Use+the+Download+Access+Script">How To guide</a>
            .
          </p>
          <p>
            <strong>Windows: </strong>
            {
              'The file can be executed within Windows by first installing a Unix-like command line utility such as '
            }
            <a href="https://www.cygwin.com/">Cygwin</a>
            {
              '. After installing Cygwin (or a similar utility), run the line \'chmod 777 download.sh\' from the utility\'s command line, and then execute by typing \'./download.sh\'.'
            }
          </p>
          <span className="order-status-item__status-text">
            {
              granuleLinksIsLoading
                ? `Retrieving files for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}...`
                : `Retrieved ${downloadLinks.length} files for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}`
            }
          </span>
        </div>
        <TextWindowActions
          id={`script-${retrievalId}`}
          fileContents={generateDownloadScript(
            downloadLinks,
            retrievalCollection,
            earthdataEnvironment
          )}
          fileName={downloadFileName}
          clipboardContents={generateDownloadScript(
            downloadLinks,
            retrievalCollection,
            earthdataEnvironment
          )}
          modalTitle="Download Script"
        >
          <pre className="download-links-panel__pre">
            {
              generateDownloadScript(downloadLinks, retrievalCollection, earthdataEnvironment)
            }
          </pre>
        </TextWindowActions>
      </>
    )
    : (
      <div className="order-status-item__tab-intro">
        The download script will become available once the order has finished processing
      </div>
    )
}

DownloadScriptPanel.propTypes = {
  accessMethodType: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  downloadLinks: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  retrievalCollection: PropTypes.shape({}).isRequired,
  retrievalId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number.isRequired,
  granuleLinksIsLoading: PropTypes.bool.isRequired
}

export default DownloadScriptPanel
