import React from 'react'
import PropTypes from 'prop-types'

import './FilterStackContents.scss'

const FilterStackContents = ({
  body = null,
  showLabel = false,
  title = null
}) => {
  if (!title || !body) return null

  const filterStackContentsClass = `filter-stack-contents ${showLabel ? 'filter-stack-contents--label-visible' : ''}`
  const filterStackLabelClass = `filter-stack-contents__label ${showLabel ? 'filter-stack-contents__label--visible' : ''}`

  return (
    <div className={filterStackContentsClass}>
      {
        title && (
          <div className={filterStackLabelClass}>{`${title}:`}</div>
        )
      }
      { body && <div className="filter-stack-contents__body">{body}</div>}
    </div>
  )
}

FilterStackContents.propTypes = {
  body: PropTypes.element,
  showLabel: PropTypes.bool,
  title: PropTypes.string
}

export default FilterStackContents
