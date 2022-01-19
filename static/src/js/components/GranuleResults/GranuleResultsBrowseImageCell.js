import React from 'react'
import PropTypes from 'prop-types'

import './GranuleResultsBrowseImageCell.scss'

/**
 * Renders GranuleResultsBrowseImageCell.
 * @param {Object} props - The props passed into the component from react-table.
 * @param {Object} props.row - The row info.
 */
export const GranuleResultsBrowseImageCell = ({ row }) => {
  const { original: rowProps } = row
  const {
    browseFlag,
    browseUrl,
    granuleThumbnail,
    title
  } = rowProps

  const buildThumbnail = () => {
    let element = null

    if (granuleThumbnail) {
      element = (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          className="granule-results-browse-image-cell__thumb-image"
          src={granuleThumbnail}
          height="60"
          width="60"
          alt={`Browse Image for ${title}`}
        />
      )

      if (browseUrl) {
        element = (
          <a
            className="granule-results-browse-image-cell__thumb"
            href={browseUrl}
            title="View image"
            target="_blank"
            rel="noopener noreferrer"
          >
            {element}
          </a>
        )
      } else {
        element = (
          <div className="granule-results-browse-image-cell__thumb">
            {element}
          </div>
        )
      }
    }
    return element
  }

  if (!browseFlag || !granuleThumbnail) {
    return (
      <div className="granule-results-browse-image-cell" />
    )
  }

  return (
    <div className="granule-results-browse-image-cell granule-results-browse-image-cell--image">
      {buildThumbnail()}
    </div>
  )
}

GranuleResultsBrowseImageCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({})
  }).isRequired
}

export default GranuleResultsBrowseImageCell
