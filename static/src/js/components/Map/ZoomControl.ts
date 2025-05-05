import React from 'react'
import ReactDOM from 'react-dom'

import { Map } from 'ol'
import Zoom, { Options as ZoomOptions } from 'ol/control/Zoom'
import EventType from 'ol/events/EventType'

import mapButton from './mapButton'

export type ZoomControlOptions = ZoomOptions & {
  /** The map to attach the control to */
  map: Map
  /** The home location to zoom to */
  homeLocation?: {
    /** The center of the map to zoom to */
    center: number[]
    /** The rotation of the map to zoom to */
    rotation: number
    /** The zoom level to zoom to */
    zoom: number
  }
  /** The icon to use for the plus button */
  PlusIcon: React.ReactNode
  /** The icon to use for the minus button */
  MinusIcon: React.ReactNode
  /** The icon to use for the home button */
  HomeIcon: React.ReactNode
  /** The duration of the zoom animation */
  duration?: number
}

/**
 * This class extends the OpenLayers Zoom control to add a home button
 */
class ZoomControl extends Zoom {
  /** The class name for the control */
  className: string

  /** The duration of the zoom animation */
  duration?: number

  /** The home location to zoom to */
  homeLocation?: {
    center: number[]
    rotation: number
    zoom: number
  }

  constructor(options: ZoomControlOptions) {
    super(options)

    const {
      duration,
      homeLocation,
      PlusIcon,
      MinusIcon,
      HomeIcon
    } = options

    this.className = 'zoom-control'

    if (duration) this.duration = duration

    // `homeLocation` is an object with the following properties:
    // - center: The center of the map to zoom to
    // - zoom: The zoom level to zoom to
    // - rotation: The rotation of the map to zoom to
    this.homeLocation = homeLocation

    // Create the home button
    const homeElement = mapButton({
      className: `${this.className}-home`,
      title: 'Zoom Home'
    })

    // Create the icon to show on the button
    // @ts-expect-error We are still on React 17
    ReactDOM.render(
      HomeIcon,
      homeElement
    )

    // Add the click event to the home button
    homeElement.addEventListener(
      EventType.CLICK,
      this.zoomHome.bind(this),
      false
    )

    const { element } = this
    let {
      firstChild: zoomInElement,
      lastChild: zoomOutElement
    } = element

    // Update the zoom in and zoom out buttons to use Bootstrap tooltips
    zoomInElement = mapButton({
      button: zoomInElement as HTMLButtonElement,
      className: `${this.className}-in`,
      title: 'Zoom In'
    })

    zoomOutElement = mapButton({
      button: zoomOutElement as HTMLButtonElement,
      className: `${this.className}-out`,
      title: 'Zoom Out'
    })

    // Replace the plus character with an icon
    // @ts-expect-error We are still on React 17
    ReactDOM.render(
      PlusIcon,
      zoomInElement
    )

    // Replace the minus character with an icon
    // @ts-expect-error We are still on React 17
    ReactDOM.render(
      MinusIcon,
      zoomOutElement
    )

    // Add the home button to the control bewteen the plus and minus buttons
    element.insertBefore(homeElement, zoomOutElement)
    element.className = this.className

    this.setMap(options.map)
  }

  /**
   * Zooms the map to the home location
   */
  zoomHome() {
    this.getMap()?.getView().animate({
      center: this.homeLocation?.center,
      duration: this.duration,
      rotation: this.homeLocation?.rotation,
      zoom: this.homeLocation?.zoom
    })
  }

  /**
   * Get the element for this control
   * @returns {HTMLElement} The element for this control
   */
  getElement() {
    return this.element
  }
}

export default ZoomControl
