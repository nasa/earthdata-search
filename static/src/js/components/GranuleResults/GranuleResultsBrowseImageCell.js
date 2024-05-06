import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import './GranuleResultsBrowseImageCell.scss'
import EDSCImage from '../EDSCImage/EDSCImage'

/**
 * Renders GranuleResultsBrowseImageCell.
 * @param {Object} props - The props passed into the component from react-table.
 * @param {Object} props.row - The row info.
 */
const buildThumbnail = (granuleThumbnail, title, browseUrl) => {
  console.log('🛑 I am memoized function and I keep being called')
  let element = null

  if (granuleThumbnail) {
    element = (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        className="granule-results-browse-image-cell__thumb-image"
        src={granuleThumbnail}
        height={60}
        width={60}
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

export const GranuleResultsBrowseImageCell = ({ row }) => {
  const { original: rowProps } = row
  const {
    browseFlag,
    browseUrl,
    granuleThumbnail,
    title
  } = rowProps
  // TODO I am hard coding the value here just to test if it had to do with the EDSCImage it doesn't look like it since with cache turned off it is still doing this
  const passedGranuleThumbnail = 'https://cmr.sit.earthdata.nasa.gov/browse-scaler/browse_images/datasets/C1200382226-CMR_ONLY?h=85&w=85'
  console.log('🚀 ~ file: GranuleResultsBrowseImageCell.js:60 ~ GranuleResultsBrowseImageCell ~ granuleThumbnail:', granuleThumbnail)

  // eslint-disable-next-line max-len
  const result = useMemo(() => buildThumbnail(passedGranuleThumbnail, title, browseUrl), [passedGranuleThumbnail])

  if (!browseFlag || !passedGranuleThumbnail) {
    return (
      <div className="granule-results-browse-image-cell" />
    )
  }

  return (
    <div className="granule-results-browse-image-cell granule-results-browse-image-cell--image">
      {result}
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
