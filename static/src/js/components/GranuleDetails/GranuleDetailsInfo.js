import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsInfo.scss'

import Spinner from '../Spinner/Spinner'

export const GranuleDetailsInfo = ({ xml }) => {
  let content
  content = xml

  if (content) {
    content = content.replace('<Granule>\n', '') // Remove top level element
    content = content.replace(/<(\w+)>/g, '$1: ') // Remove '<>' from around opening brackets and add ': '
    content = content.replace(/<\/\w+>/g, '') // Remove all closing brackets
    content = content.replace(/(: \n)/g, ':\n') // Remove blank spaces before newlines
    content = content.replace(/^\s*$\n/gm, '') // Remove empty lines
    content = content.replace(/^\s*<\w+\s+\w+="\w+"(|\/)>$\n/g, '') // Remove empty elements with attributes
  }

  return (
    <div className="granule-details-info">
      <div className="granule-details-info__content">
        {
          content && content
        }
        {
          !content && (
            <Spinner
              className="granule-details-info__spinner"
              type="dots"
              size="small"
            />
          )
        }
      </div>
    </div>
  )
}

GranuleDetailsInfo.defaultProps = {
  xml: null
}

GranuleDetailsInfo.propTypes = {
  xml: PropTypes.string
}

export default GranuleDetailsInfo
