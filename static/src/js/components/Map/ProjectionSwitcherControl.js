import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'
import projectionCodes from '../../constants/projectionCodes'

/**
 * This class class adds 3 buttons to the map to switch between projections
 */
class ProjectionSwitcherControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')
    element.className = 'edsc-map__projection-switcher'

    super({
      ...options,
      element
    })

    this.onChangeProjection = options.onChangeProjection

    // Create the North Polar Stereographic button
    const arcticButton = document.createElement('button')
    arcticButton.className = 'edsc-map__projection-switcher__button edsc-map__projection-switcher__button--arctic edsc-map__controls__button'
    arcticButton.ariaLabel = 'North Polar Stereographic'
    arcticButton.title = 'North Polar Stereographic'
    arcticButton.setAttribute('data-bs-toggle', 'tooltip')
    arcticButton.setAttribute('data-bs-placement', 'left')
    arcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.arctic),
      false
    )

    // Add the button to the element
    element.appendChild(arcticButton)

    // Create the Geographic (Equirectangular) button
    const geographicButton = document.createElement('button')
    geographicButton.className = 'edsc-map__projection-switcher__button edsc-map__projection-switcher__button--geo edsc-map__controls__button'
    geographicButton.ariaLabel = 'Geographic (Equirectangular)'
    geographicButton.title = 'Geographic (Equirectangular)'
    geographicButton.setAttribute('data-bs-toggle', 'tooltip')
    geographicButton.setAttribute('data-bs-placement', 'left')
    geographicButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.geographic),
      false
    )

    // Add the button to the element
    element.appendChild(geographicButton)

    // Create the South Polar Stereographic button
    const antarcticButton = document.createElement('button')
    antarcticButton.className = 'edsc-map__projection-switcher__button edsc-map__projection-switcher__button--antarctic edsc-map__controls__button'
    antarcticButton.ariaLabel = 'South Polar Stereographic'
    antarcticButton.title = 'South Polar Stereographic'
    antarcticButton.setAttribute('data-bs-toggle', 'tooltip')
    antarcticButton.setAttribute('data-bs-placement', 'left')
    antarcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.antarctic),
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
