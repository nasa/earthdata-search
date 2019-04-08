import React from 'react'
import PropTypes from 'prop-types'

import './FilterStackContents.scss'

const FilterStackContents = (props) => {
  const {
    body,
    title
  } = props

  if (!title || !body) return null

  return (
    <div className="filter-stack-contents">
      { title && <strong>{`${title}:`}</strong>}
      &nbsp;
      { body && <div className="filter-stack-contents__body">{body}</div>}
    </div>
  )
}

FilterStackContents.defaultProps = {
  body: null,
  title: null
}

FilterStackContents.propTypes = {
  body: PropTypes.element,
  title: PropTypes.string
}

export default FilterStackContents
