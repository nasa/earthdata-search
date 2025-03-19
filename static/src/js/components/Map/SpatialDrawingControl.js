import ReactDOM from 'react-dom'

import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'

import spatialTypes from '../../constants/spatialTypes'

/**
 * This class adds spatial drawing buttons to the map
 */
class SpatialDrawingControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')
    element.className = 'edsc-map-spatial-drawing'

    super({
      ...options,
      element
    })

    const {
      handleDrawingCancel,
      handleDrawingStart,
      CircleIcon,
      PointIcon
    } = options

    this.handleDrawingCancel = handleDrawingCancel
    this.handleDrawingStart = handleDrawingStart

    // Create the polygon button
    const polygonButton = document.createElement('button')
    polygonButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--polygon edsc-icon-poly edsc-icon-fw'
    polygonButton.ariaLabel = 'Search by spatial polygon'
    polygonButton.title = 'Search by spatial polygon'
    polygonButton.setAttribute('data-bs-toggle', 'tooltip')
    polygonButton.setAttribute('data-bs-placement', 'left')

    // Set the click event for the button
    polygonButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.POLYGON),
      false
    )

    // Add the button to the element
    element.appendChild(polygonButton)

    // Create the bounding box button
    const boundingBoxButton = document.createElement('button')
    boundingBoxButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--rectangle edsc-icon-rect edsc-icon-fw'
    boundingBoxButton.ariaLabel = 'Search by spatial rectangle'
    boundingBoxButton.title = 'Search by spatial rectangle'
    boundingBoxButton.setAttribute('data-bs-toggle', 'tooltip')
    boundingBoxButton.setAttribute('data-bs-placement', 'left')

    // Set the click event for the button
    boundingBoxButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.BOUNDING_BOX),
      false
    )

    // Add the button to the element
    element.appendChild(boundingBoxButton)

    // Create the circle button
    const circleButton = document.createElement('button')
    circleButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--circle'
    circleButton.ariaLabel = 'Search by spatial circle'
    circleButton.title = 'Search by spatial circle'
    circleButton.setAttribute('data-bs-toggle', 'tooltip')
    circleButton.setAttribute('data-bs-placement', 'left')

    // Set the click event for the button
    circleButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.CIRCLE),
      false
    )

    // Render the circle icon
    ReactDOM.render(
      CircleIcon,
      circleButton
    )

    // Add the button to the element
    element.appendChild(circleButton)

    // Create the point button
    const pointButton = document.createElement('button')
    pointButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--point'
    pointButton.ariaLabel = 'Search by spatial coordinate'
    pointButton.title = 'Search by spatial coordinate'
    pointButton.setAttribute('data-bs-toggle', 'tooltip')
    pointButton.setAttribute('data-bs-placement', 'left')

    // Set the click event for the button
    pointButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.POINT),
      false
    )

    // Render the point icon
    ReactDOM.render(
      PointIcon,
      pointButton
    )

    // Add the button to the element
    element.appendChild(pointButton)
  }

  /**
   * When a spatial button is clicked, call handleDrawingStart with the spatial type
   * @param {String} spatialType - The type of spatial drawing
   */
  handleSpatialClick(spatialType, event) {
    event.stopPropagation()

    this.handleDrawingStart(spatialType)
  }
}

export default SpatialDrawingControl
