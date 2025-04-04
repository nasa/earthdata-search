import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import EventType from 'ol/events/EventType'
import { baseLayerIds } from '../../constants/mapLayers'

/**
 * This class adds a layer switcher control to the map
 */
class LayerSwitcherControl extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = options.className

    super({
      ...options,
      element
    })

    this.options = options
    this.onChangeLayer = options.onChangeLayer

    const toggleButton = document.createElement('button')
    toggleButton.className = `${options.className}__button`
    toggleButton.setAttribute('type', 'button')
    toggleButton.title = 'Layer Options'
    toggleButton.ariaLabel = 'Layer Options'

    if (options.LayersIcon) {
      ReactDOM.render(
        options.LayersIcon,
        toggleButton
      )
    }

    element.appendChild(toggleButton)

    const panel = document.createElement('div')
    panel.className = `${options.className}__panel`

    this.addLayerOptions(panel)
    element.appendChild(panel)

    element.addEventListener('mouseenter', () => {
      panel.classList.add(`${options.className}__panel--visible`)
    })

    element.addEventListener('mouseleave', () => {
      panel.classList.remove(`${options.className}__panel--visible`)
    })
  }

  /**
   * Adds layer options to the panel
   */
  addLayerOptions(panel) {
    const { className } = this.options
    const { layerOptions } = this.options

    const optionsContainer = document.createElement('div')
    optionsContainer.className = `${className}__options`

    // Track how many base layers we've added
    let baseLayersAdded = 0

    layerOptions.forEach((option) => {
      const optionContainer = document.createElement('div')
      optionContainer.className = `${className}__option`

      const isBaseLayer = baseLayerIds.includes(option.id)

      const input = document.createElement('input')
      input.type = isBaseLayer ? 'radio' : 'checkbox'
      input.name = isBaseLayer ? 'base-layer' : option.id
      input.id = `layer-${option.id}`
      input.checked = option.checked || false

      input.addEventListener(EventType.CHANGE, () => {
        this.onChangeLayer({
          id: option.id,
          checked: input.checked,
          type: input.type
        })
      })

      const label = document.createElement('label')
      label.htmlFor = `layer-${option.id}`
      label.textContent = option.label

      optionContainer.appendChild(input)
      optionContainer.appendChild(label)
      optionsContainer.appendChild(optionContainer)

      // If this is a base layer, increment our counter
      if (isBaseLayer) {
        baseLayersAdded += 1

        // If this was the last base layer, add a separator after it
        if (baseLayersAdded === baseLayerIds.length) {
          const separator = document.createElement('hr')
          separator.className = `${className}__separator`
          optionsContainer.appendChild(separator)
        }
      }
    })

    // Add the attribution footnote for OpenStreetMap
    const attribution = document.createElement('div')
    attribution.className = `${className}__attribution`
    attribution.innerHTML = '&ast; &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'

    panel.appendChild(optionsContainer)
    panel.appendChild(attribution)
  }
}

export default LayerSwitcherControl
