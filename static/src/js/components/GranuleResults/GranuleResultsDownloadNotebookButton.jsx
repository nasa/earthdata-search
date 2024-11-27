import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, Tab } from 'react-bootstrap'
import { PropTypes } from 'prop-types'
import { Download, CloudFill } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaFileCode } from 'react-icons/fa'

import Button from '../Button/Button'
import CopyableText from '../CopyableText/CopyableText'
import EDSCTabs from '../EDSCTabs/EDSCTabs'
import ExternalLink from '../ExternalLink/ExternalLink'

import { addToast } from '../../util/addToast'
import { getFilenameFromPath } from '../../util/getFilenameFromPath'

import './GranuleResultsDownloadNotebookButton.scss'

/**
 * Renders CustomDownloadNotebookToggle.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.onClick - The click callback.null
 */
// eslint-disable-next-line react/display-name
export const CustomDownloadNotebookToggle = React.forwardRef(({
  onClick
}, ref) => {
  const handleClick = (event) => {
    onClick(event)

    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <Button
      className="button granule-results-download-notebook-button__button"
      type="button"
      icon={FaFileCode}
      ref={ref}
      tooltip="Download sample notebook"
      tooltipId="download-notebook-button"
      onClick={handleClick}
    />
  )
})

CustomDownloadNotebookToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}

/**
 * Renders GranuleResultsDataLinksButton.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.buttonVariant - The button variant.
 * @param {String} props.collectionId - The collection ID.
 * @param {Object} props.directDistributionInformation - The collection direct distribution information.
 * @param {Array} props.dataLinks - An array of data links.
 * @param {Array} props.s3Links - An array of AWS S3 links.
 * @param {Function} props.onMetricsDataAccess - The metrics callback.
 */
export const GranuleResultsDataLinksButton = ({
  collectionQuerySpatial,
  generateNotebook,
  generateNotebookTag,
  granuleId,
  onGenerateNotebook,
  onMetricsDataAccess
}) => {
  const dropdownMenuRef = useRef(null)
  const { variableConceptId: variableId } = generateNotebookTag
  const { boundingBox: boundingBoxes } = collectionQuerySpatial
  const [boundingBox] = boundingBoxes || []

  let generateNotebookParams = {
    granuleId,
    referrerUrl: window.location.href
  }

  if (boundingBox) {
    generateNotebookParams = {
      ...generateNotebookParams,
      boundingBox
    }
  }

  if (variableId) {
    generateNotebookParams = {
      ...generateNotebookParams,
      variableId
    }
  }

  return (
    <Dropdown drop="bottom">
      <Dropdown.Toggle as={CustomDownloadNotebookToggle} />
      {
        ReactDOM.createPortal(
          <Dropdown.Menu
            ref={dropdownMenuRef}
            className="granule-results-download-notebook-button__menu"
          >
            <h3 className="granule-results-download-notebook-button__menu-panel-heading mb-0">Download Sample Notebook</h3>
            <div className="p-3">
              <p>
                Download a sample Jupyter Notebook to learn how to access and analyze
                this granule with Python, on your computer or in the cloud.
              </p>
              <Button
                spinner={generateNotebook[granuleId] === 'loading'}
                bootstrapVariant="primary"
                icon={Download}
                onClick={() => onGenerateNotebook(generateNotebookParams)}
              >
                Download Notebook
              </Button>
            </div>
          </Dropdown.Menu>,
          document.querySelector('#root')
        )
      }
    </Dropdown>
  )
}

GranuleResultsDataLinksButton.displayName = 'GranuleResultsDataLinksButton'

GranuleResultsDataLinksButton.propTypes = {
  granuleId: PropTypes.string.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsDataLinksButton
