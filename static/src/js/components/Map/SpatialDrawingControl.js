import ReactDOM from 'react-dom'

import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'

import spatialTypes from '../../constants/spatialTypes'
import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'
import mapButton from './mapButton'

import './SpatialDrawingControl.scss'

/**
 * This class adds spatial drawing buttons to the map
 */
class SpatialDrawingControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')

    const buttonsElement = document.createElement('div')
    element.appendChild(buttonsElement)

    const cancelWrapper = document.createElement('div')
    element.appendChild(cancelWrapper)

    super({
      ...options,
      element
    })

    this.className = 'spatial-drawing-control'
    element.className = this.className
    cancelWrapper.className = `${this.className}__cancel-wrapper`

    const {
      CircleIcon,
      onToggleShapefileUploadModal,
      PointIcon,
      ShapefileIcon
    } = options

    this.onToggleShapefileUploadModal = onToggleShapefileUploadModal

    // Create the polygon button
    const polygonButton = mapButton({
      className: `${this.className}__button ${this.className}__button--polygon edsc-icon-poly edsc-icon-fw`,
      title: 'Search by spatial polygon'
    })

    // Set the click event for the button
    polygonButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.POLYGON),
      false
    )

    // Add the button to the element
    buttonsElement.appendChild(polygonButton)

    // Create the bounding box button
    const boundingBoxButton = mapButton({
      className: `${this.className}__button ${this.className}__button--rectangle edsc-icon-rect edsc-icon-fw`,
      title: 'Search by spatial rectangle'
    })

    // Set the click event for the button
    boundingBoxButton.addEventListener(
      EventType.CLICK,
      this.handleSpatialClick.bind(this, spatialTypes.BOUNDING_BOX),
      false
    )

    // Add the button to the element
    buttonsElement.appendChild(boundingBoxButton)

    // Create the circle button
    const circleButton = mapButton({
      className: `${this.className}__button ${this.className}__button--circle`,
      title: 'Search by spatial circle'
    })

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
    const pointButton = mapButton({
      className: `${this.className}__button ${this.className}__button--point`,
      title: 'Search by spatial coordinate'
    })

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

    // Create the shapefile button
    const shapefileButton = mapButton({
      className: `${this.className}__button ${this.className}__button--shapefile`,
      title: 'Search by shapefile'
    })

    // Set the click event for the button
    shapefileButton.addEventListener(
      EventType.CLICK,
      this.handleShapefileClick.bind(this),
      false
    )

    // Render the shapefile icon
    ReactDOM.render(
      ShapefileIcon,
      shapefileButton
    )

    // Add the button to the element
    buttonsElement.appendChild(shapefileButton)

    // Create the cancel button
    const cancelButton = mapButton({
      title: 'Cancel',
      tooltip: false
    })
    cancelButton.className = `${this.className}__button ${this.className}__button--cancel bg-white`
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

  /**
   * When the shapefile button is clicked, open the shapefile upload modal
   * @param {Object} event - The click event
   */
  handleShapefileClick(event) {
    event.stopPropagation()

    this.onToggleShapefileUploadModal(true)
  }
}

export default SpatialDrawingControl
