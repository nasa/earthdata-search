import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import { PropTypes } from 'prop-types'
import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaFileCode } from 'react-icons/fa'
import { useLazyQuery } from '@apollo/client'

import Button from '../Button/Button'

import useEdscStore from '../../zustand/useEdscStore'

import { buildNotebook } from '../../util/notebooks/buildNotebook'
import { constructDownloadableFile } from '../../util/files/constructDownloadableFile'

import GET_NOTEBOOK_GRANULES from '../../operations/queries/getNotebookGranules'
import { apolloClientNames } from '../../constants/apolloClientNames'

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
 * @param {Object} props.generateNotebookTag - The contents of the generate_notebook tag
 * @param {Array} props.granuleId - The granule id
 */
export const GranuleResultsDownloadNotebookButton = ({
  collectionQuerySpatial,
  generateNotebookTag,
  granuleId
}) => {
  const handleError = useEdscStore((state) => state.errors.handleError)
  const dropdownMenuRef = useRef(null)
  const { variable_concept_id: variableId } = generateNotebookTag
  const { boundingBox: boundingBoxes } = collectionQuerySpatial
  const [boundingBox] = boundingBoxes || []

  const [generateNotebook, { data, loading, error }] = useLazyQuery(GET_NOTEBOOK_GRANULES, {
    variables: {
      granulesParams: {
        conceptId: granuleId
      },
      variablesParams: {
        conceptId: variableId
      }
    },
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    }
  })

  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'generateNotebook'
      })
    }
  }, [error])

  useEffect(() => {
    // If data was retrieved, generate the notebook for download
    if (data) {
      const { granules } = data

      // Build the notebook file
      const { fileName, notebook } = buildNotebook({
        boundingBox,
        granuleId,
        granules,
        referrerUrl: window.location.href
      })

      // Download the notebook file
      constructDownloadableFile(JSON.stringify(notebook), fileName, 'application/x-ipynb+json')
    }
  }, [data])

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
                spinner={loading}
                bootstrapVariant="primary"
                icon={Download}
                onClick={() => generateNotebook()}
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
    variable_concept_id: PropTypes.string
  }).isRequired
}

export default GranuleResultsDownloadNotebookButton
