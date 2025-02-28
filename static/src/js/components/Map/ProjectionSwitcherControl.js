import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'
import projections from '../../util/map/projections'

/**
 * This class class adds 3 buttons to the map to switch between projections
 */
class ProjectionSwitcherControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')
    element.className = 'edsc-map-projection-switcher ol-unselectable ol-control'

    super({
      ...options,
      element
    })

    this.onChangeProjection = options.onChangeProjection

    // Create the North Polar Stereographic button
    const arcticButton = document.createElement('button')
    arcticButton.className = 'edsc-map-projection-switcher__button edsc-map-projection-switcher__button--arctic'
    arcticButton.ariaLabel = 'North Polar Stereographic'
    arcticButton.title = 'North Polar Stereographic'
    arcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projections.arctic),
      false
    )

    // Add the button to the element
    element.appendChild(arcticButton)

    // Create the Geographic (Equirectangular) button
    const geographicButton = document.createElement('button')
    geographicButton.className = 'edsc-map-projection-switcher__button edsc-map-projection-switcher__button--geo'
    geographicButton.ariaLabel = 'Geographic (Equirectangular)'
    geographicButton.title = 'Geographic (Equirectangular)'
    geographicButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projections.geographic),
      false
    )

    // Add the button to the element
    element.appendChild(geographicButton)

    // Create the South Polar Stereographic button
    const antarcticButton = document.createElement('button')
    antarcticButton.className = 'edsc-map-projection-switcher__button edsc-map-projection-switcher__button--antarctic'
    antarcticButton.ariaLabel = 'South Polar Stereographic'
    antarcticButton.title = 'South Polar Stereographic'
    antarcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projections.antarctic),
      false
    )

    // Add the button to the element
    element.appendChild(antarcticButton)
  }

  /**
   * Zooms the map to the home location
   */
  changeProjection(newProjectionCode) {
    this.onChangeProjection(newProjectionCode)
  }
}

export default ProjectionSwitcherControl
