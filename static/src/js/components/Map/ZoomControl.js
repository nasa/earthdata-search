import ReactDOM from 'react-dom'

import Zoom from 'ol/control/Zoom'
import EventType from 'ol/events/EventType'

/**
 * This class extends the OpenLayers Zoom control to add a home button
 */
class ZoomControl extends Zoom {
  constructor(options) {
    super(options)

    this.options = options
    const {
      homeLocation,
      PlusIcon,
      MinusIcon,
      HomeIcon
    } = options

    // `homeLocation` is an object with the following properties:
    // - center: The center of the map to zoom to
    // - zoom: The zoom level to zoom to
    // - rotation: The rotation of the map to zoom to
    this.homeLocation = homeLocation

    // Create the home button
    const homeElement = document.createElement('button')
    homeElement.className = `${options.className}-home`
    homeElement.setAttribute('type', 'button')
    homeElement.setAttribute('data-bs-toggle', 'tooltip')
    homeElement.setAttribute('data-bs-placement', 'left')
    homeElement.setAttribute('data-bs-title', 'Zoom Home')

    // Create the icon to show on the button
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
    const {
      firstChild: zoomInElement,
      lastChild: zoomOutElement
    } = element

    // Update the zoom in and zoom out buttons to use Bootstrap tooltips
    zoomInElement.setAttribute('data-bs-toggle', 'tooltip')
    zoomInElement.setAttribute('data-bs-placement', 'left')
    zoomInElement.setAttribute('data-bs-title', 'Zoom In')

    zoomOutElement.setAttribute('data-bs-toggle', 'tooltip')
    zoomOutElement.setAttribute('data-bs-placement', 'left')
    zoomOutElement.setAttribute('data-bs-title', 'Zoom Out')

    // Replace the plus character with an icon
    ReactDOM.render(
      PlusIcon,
      zoomInElement
    )

    // Replace the minus character with an icon
    ReactDOM.render(
      MinusIcon,
      zoomOutElement
    )

    // Add the home button to the control bewteen the plus and minus buttons
    element.insertBefore(homeElement, zoomOutElement)
    element.className = options.className

    this.setMap(options.map)
  }

  /**
   * Zooms the map to the home location
   */
  zoomHome() {
    this.getMap().getView().animate({
      center: this.homeLocation.center,
      duration: this.duration || this.options.duration || 250,
      rotation: this.homeLocation.rotation,
      zoom: this.homeLocation.zoom
    })
  }
}

export default ZoomControl
