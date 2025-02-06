import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locationPropType } from '../../util/propTypes/location'
import { pathStartsWith } from '../../util/pathStartsWith'

import './WrappingContainer.scss'

export const WrappingContainer = (props) => {
  const {
    children,
    location
  } = props
  const { search, pathname } = location
  let isMapPage = ['/search']

  // Currently saved projects and a project page share a route as such we must determine if we are on the saved projects page
  // If we are on the project page i.e. a specific project we will have the map included in the DOM and need to adjust the classname
  if (pathname === '/projects' && search) {
    isMapPage = [...isMapPage, '/projects']
  }

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
  children: PropTypes.node.isRequired,
  location: locationPropType.isRequired
}

export default withRouter(WrappingContainer)
