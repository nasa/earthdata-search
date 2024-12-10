import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { PropTypes } from 'prop-types'
import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaFileCode } from 'react-icons/fa'

import Button from '../Button/Button'

import './GranuleResultsDownloadNotebookButton.scss'

/**
 * Renders CustomDownloadNotebookToggle.
 * @param {Object} props - The props passed into the component
 * @param {Function} props.id - The granule id
 * @param {Function} props.onClick - The click callback.null
 */
// eslint-disable-next-line react/display-name
export const CustomDownloadNotebookToggle = React.forwardRef(({
  id,
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
      label="Download sample notebook"
      tooltip="Download sample notebook"
      tooltipId={`download-notebook-button-${id}`}
      onClick={handleClick}
    />
  )
})

CustomDownloadNotebookToggle.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

/**
 * Renders GranuleResultsDownloadNotebookButton.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionQuerySpatial - The current collection spatial.
 * @param {String} props.generateNotebook - The state for generating notebooks
 * @param {Object} props.generateNotebookTag - The contents of the generate_notebook tag
 * @param {Array} props.granuleId - The granule id
 * @param {Array} props.onGenerateNotebook - A callback to trigger the notebook generation
 */
export const GranuleResultsDownloadNotebookButton = ({
  collectionQuerySpatial,
  generateNotebook,
  generateNotebookTag,
  granuleId,
  onGenerateNotebook
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

  const rootElement = document.getElementById('#root') || document.body

  return (
    <Dropdown
      onClick={
        (event) => {
          event.stopPropagation()
        }
      }
      drop="down"
    >
      <Dropdown.Toggle as={CustomDownloadNotebookToggle} id={granuleId} />
      {
        ReactDOM.createPortal(
          <Dropdown.Menu
            ref={dropdownMenuRef}
            className="granule-results-download-notebook-button__menu"
            data-testid="dropdown-menu"
            aria-labelledby="notebook-menu-heading"
          >
            <h3
              id="notebook-menu-heading"
              className="granule-results-download-notebook-button__menu-panel-heading mb-0"
            >
              Download Sample Notebook
            </h3>
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
          rootElement
        )
      }
    </Dropdown>
  )
}

GranuleResultsDownloadNotebookButton.displayName = 'GranuleResultsDownloadNotebookButton'

GranuleResultsDownloadNotebookButton.propTypes = {
  granuleId: PropTypes.string.isRequired,
  collectionQuerySpatial: PropTypes.shape({
    boundingBox: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  generateNotebookTag: PropTypes.shape({
    variableConceptId: PropTypes.string
  }).isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  onGenerateNotebook: PropTypes.func.isRequired
}

export default GranuleResultsDownloadNotebookButton
