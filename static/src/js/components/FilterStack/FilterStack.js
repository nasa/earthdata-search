import React from 'react'
import PropTypes from 'prop-types'

import './FilterStack.scss'

const FilterStack = (props) => {
  const {
    children,
    visible
  } = props

  if (!children) return null

  return (
    <ul className={`filter-stack ${visible && 'filter-stack--visible'}`}>
      {children}
    </ul>
  )
}

FilterStack.defaultProps = {
  children: null
}

FilterStack.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool.isRequired
}

export default FilterStack
