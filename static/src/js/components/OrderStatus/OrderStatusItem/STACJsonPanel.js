import React from 'react'
import PropTypes from 'prop-types'

import { pluralize } from '../../../util/pluralize'
import { commafy } from '../../../util/commafy'

import TextWindowActions from '../../TextWindowActions/TextWindowActions'

/**
 * Renders STACJsonPanel.
 * @param {Object} arg0 - The props passed into the component.
 * @param {String} arg0.accessMethodType - The retrieval collection access method.
 * @param {Array} arg0.stacLinks - The STAC links links.
 * @param {String} arg0.retrievalId - The retrieval id.
 * @param {Number} arg0.granuleCount - The retrieval collection granule count.
 * @param {Boolean} arg0.stacLinksIsLoading - A flag set when the STAC links are loading.
*/
export const STACJsonPanel = ({
  accessMethodType,
  stacLinks,
  retrievalId,
  granuleCount,
  stacLinksIsLoading
}) => {
  const downloadFileName = `${retrievalId}-${accessMethodType}-STAC.txt`

  return stacLinks.length > 0 ? (
    <>
      <div className="order-status-item__tab-intro">
        <span className="order-status-item__status-text">
          {
            stacLinksIsLoading
              ? `Retrieving STAC links for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}...`
              : `Retrieved ${stacLinks.length} STAC ${pluralize('links', stacLinks.length)} for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}`
          }
        </span>
      </div>
      <TextWindowActions
        id={`links-${retrievalId}`}
        fileContents={stacLinks.join('\n')}
        fileName={downloadFileName}
        clipboardContents={stacLinks.join('\n')}
        modalTitle="STAC Links"
      >
        <ul className="download-links-panel__list">
          {
            stacLinks.map((link, i) => {
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
        STAC links will become available once the order has finished processing.
      </div>
    )
}

STACJsonPanel.propTypes = {
  accessMethodType: PropTypes.string.isRequired,
  stacLinks: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  retrievalId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number.isRequired,
  stacLinksIsLoading: PropTypes.bool.isRequired
}

export default STACJsonPanel
