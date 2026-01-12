import React from 'react'
import PropTypes from 'prop-types'
import { castArray } from 'lodash-es'

import './ArrowTags.scss'

const ArrowTags = ({
  className = '',
  tags
}) => {
  if (!tags.length) return []

  const tagsList = (
    <ul className={`arrow-tags ${className}`}>
      {
        castArray(tags).map((tag, index) => {
          const key = `arrow-tags_${index}`

          if (tag) {
            return (
              <li
                key={key}
                className="arrow-tags__list-item"
              >
                {tag}
              </li>
            )
          }

          return null
        })
      }
    </ul>
  )

  return tagsList
}

ArrowTags.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ArrowTags
