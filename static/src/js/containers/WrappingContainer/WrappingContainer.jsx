import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { pathStartsWith } from '../../util/pathStartsWith'

import { routes } from '../../constants/routes'

import './WrappingContainer.scss'

export const WrappingContainer = (props) => {
  const {
    children
  } = props

  const location = useLocation()
  const { pathname } = location

  const isMapPage = [routes.SEARCH, routes.PROJECT]

  let addMapPageStyles = false

  if (pathStartsWith(pathname, isMapPage)) {
    addMapPageStyles = true
  }

  const wrappingContainerClassnames = classNames(['wrapping-container', { 'wrapping-container--map-page': addMapPageStyles }])

  return (
    <div id="wrapping-container" data-testid="parent-container" className={wrappingContainerClassnames}>
      {children}
    </div>
  )
}

WrappingContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default WrappingContainer
