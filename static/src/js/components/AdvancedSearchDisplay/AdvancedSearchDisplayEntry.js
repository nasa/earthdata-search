import React from 'react'
import { pure } from 'recompose'
import PropTypes from 'prop-types'

const AdvancedSearchDisplayEntry = pure(({
  children
}) => (
  <>
    { children }
  </>
))

AdvancedSearchDisplayEntry.defaultProps = {
  children: null
}

AdvancedSearchDisplayEntry.propTypes = {
  children: PropTypes.node
}

export default AdvancedSearchDisplayEntry
