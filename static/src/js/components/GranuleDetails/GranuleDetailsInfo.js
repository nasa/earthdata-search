import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsInfo.scss'

export const GranuleDetailsInfo = ({ xml }) => {
  let content = xml

  content = content.replace('<Granule>\n', '') // Remove top level element
  content = content.replace(/<(\w+)>/g, '$1: ') // Remove '<>' from around opening brackets and add ': '
  content = content.replace(/<\/\w+>/g, '') // Remove all closing brackets
  content = content.replace(/^\s*$\n/gm, '') // Remove empty lines
  content = content.replace(/^\s*<\w+\s+\w+="\w+"(|\/)>$\n/g, '') // Remove empty elements with attributes

  return (
    <div className="granule-details-info">
      <div className="granule-details-info__content">
        {content}
      </div>
    </div>
  )
}

GranuleDetailsInfo.propTypes = {
  xml: PropTypes.string.isRequired
}

export default GranuleDetailsInfo
