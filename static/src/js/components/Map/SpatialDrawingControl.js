import ReactDOM from 'react-dom'

import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'

import spatialTypes from '../../constants/spatialTypes'
import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'

/**
 * This class adds spatial drawing buttons to the map
 */
class SpatialDrawingControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')
    element.className = 'edsc-map-spatial-drawing'

    const buttonsElement = document.createElement('div')
    element.appendChild(buttonsElement)

    const cancelWrapper = document.createElement('div')
    cancelWrapper.className = 'edsc-map-spatial-drawing__cancel-wrapper'
    element.appendChild(cancelWrapper)

    super({
      ...options,
      element
    })

    const {
      CircleIcon,
      PointIcon
    } = options

    // Create the polygon button
    const polygonButton = document.createElement('button')
    polygonButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--polygon edsc-icon-poly edsc-icon-fw edsc-map-controls__button'
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
    buttonsElement.appendChild(polygonButton)

    // Create the bounding box button
    const boundingBoxButton = document.createElement('button')
    boundingBoxButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--rectangle edsc-icon-rect edsc-icon-fw edsc-map-controls__button'
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
    buttonsElement.appendChild(boundingBoxButton)

    // Create the circle button
    const circleButton = document.createElement('button')
    circleButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--circle edsc-map-controls__button'
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
    buttonsElement.appendChild(circleButton)

    // Create the point button
    const pointButton = document.createElement('button')
    pointButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--point edsc-map-controls__button'
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
    buttonsElement.appendChild(pointButton)

    // Create the cancel button
    const cancelButton = document.createElement('button')
    cancelButton.className = 'edsc-map-spatial-drawing__button edsc-map-spatial-drawing__button--cancel'
    cancelButton.ariaLabel = 'Cancel spatial drawing'
    cancelButton.title = 'Cancel spatial drawing'
    cancelButton.textContent = 'Cancel'
    cancelButton.style.display = 'none'

    // Set the click event for the button
    cancelButton.addEventListener(
      EventType.CLICK,
      this.handleCancelClick.bind(this),
      false
    )

    // Add the button to the element
    cancelWrapper.appendChild(cancelButton)
    this.cancelButton = cancelButton

    eventEmitter.on(mapEventTypes.DRAWSTART, this.showCancelButton.bind(this))
    eventEmitter.on(mapEventTypes.DRAWEND, this.hideCancelButton.bind(this))
  }

  /**
   * Dispose of the control
   */
  disposeInternal() {
    // Remove the event listeners
    eventEmitter.off(mapEventTypes.DRAWSTART, this.showCancelButton.bind(this))
    eventEmitter.off(mapEventTypes.DRAWEND, this.hideCancelButton.bind(this))

    // Dispose of the control
    super.disposeInternal()
  }

  /**
   * Show the cancel button
   */
  showCancelButton() {
    this.cancelButton.style.display = 'block'
  }

  /**
   * Hide the cancel button
   */
  hideCancelButton() {
    this.cancelButton.style.display = 'none'
  }

  /**
   * When a spatial button is clicked, emit the DRAWSTART event with the spatial type
   * @param {String} spatialType - The type of spatial drawing
   * @param {Object} event - The click event
   */
  handleSpatialClick(spatialType, event) {
    event.stopPropagation()

    eventEmitter.emit(mapEventTypes.DRAWSTART, spatialType)
  }

  /**
   * When the cancel button is clicked, emit the DRAWCANCEL event
   * @param {Object} event - The click event
   */
  handleCancelClick(event) {
    event.stopPropagation()

    eventEmitter.emit(mapEventTypes.DRAWCANCEL)
  }
}

export default SpatialDrawingControl
