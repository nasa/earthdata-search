import React from 'react'
import PropTypes from 'prop-types'
import { castArray } from 'lodash'

import './ArrowTags.scss'

export const ArrowTags = ({ className, tags }) => {
  if (!tags.length) return []

  const tagsList = (
    <ul className={`arrow-tags ${className}`}>
      {castArray(tags).map((tag, i) => {
        const key = `arrow-tags_${i}`
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
      })}
    </ul>
  )

  return tagsList
}

export default ArrowTags

ArrowTags.defaultProps = {
  className: ''
}

ArrowTags.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired
}
