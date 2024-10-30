import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locationPropType } from '../../util/propTypes/location'
import { pathStartsWith } from '../../util/pathStartsWith'

import './WrappingContainer.scss'

export const WrappingContainer = (props) => {
  const {
    location,
    children
  } = props
  const { search, pathname } = location
  let isMapPage = ['/search']

  // Currently saved projects and a project page share route1
  if (pathname === '/projects' && search) {
    isMapPage = [...isMapPage, '/projects']
  }

  let addMapPageStyles = false
  if (pathStartsWith(pathname, isMapPage)) {
    addMapPageStyles = true
  }

  const wrappingContainerClassnames = classNames(['wrapping-container', { 'wrapping-container--map-page': addMapPageStyles }])

  return (
    <div id="wrapping-container" className={wrappingContainerClassnames}>
      {children}
    </div>
  )
}

WrappingContainer.propTypes = {
  location: locationPropType.isRequired,
  children: PropTypes.node.isRequired
}

export default withRouter(WrappingContainer)
