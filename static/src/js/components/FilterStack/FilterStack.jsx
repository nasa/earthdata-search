import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FilterStack.scss'

const FilterStack = ({
  children = null,
  isOpen
}) => {
  if (!children) return null

  const className = classNames({
    'filter-stack': true,
    'filter-stack--is-open': isOpen
  })

  return (
    <ul className={className}>
      {children}
    </ul>
  )
}

FilterStack.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired
}

export default FilterStack
