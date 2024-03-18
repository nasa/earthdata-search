import React from 'react'
import PropTypes from 'prop-types'

import './GranuleResultsBrowseImageCell.scss'
import EDSCImage from '../EDSCImage/EDSCImage'

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
  console.log('🚀 ~ file: GranuleResultsBrowseImageCell.js:19 ~ GranuleResultsBrowseImageCell ~ granuleThumbnail:', granuleThumbnail)

  const buildThumbnail = () => {
    let element = null
    // TODO I think this is the issue
    if (granuleThumbnail) {
      console.log('🚀 ~ file: GranuleResultsBrowseImageCell.js:25 ~ buildThumbnail ~ granuleThumbnail:', granuleThumbnail)
      element = (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <EDSCImage
          className="granule-results-browse-image-cell__thumb-image"
          src={granuleThumbnail}
          height={60}
          width={60}
          alt={`Browse Image for ${title}`}
          isBase64Image
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
    original: PropTypes.shape({
      browseFlag: PropTypes.bool,
      browseUrl: PropTypes.string,
      granuleThumbnail: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired
}

export default GranuleResultsBrowseImageCell
