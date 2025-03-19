import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import EventType from 'ol/events/EventType'

/**
 * This class adds a layer switcher control to the map
 */
class LayerSwitcherControl extends Control {
  constructor(options) {
    // Create the main element for this control
    const element = document.createElement('div')
    element.className = options.className || 'edsc-map-layer-switcher ol-unselectable ol-control'

    super({
      ...options,
      element
    })

    // Store the options and layer change callback
    this.options = options
    this.onChangeLayer = options.onChangeLayer || (() => {})

    const toggleButton = document.createElement('button')
    toggleButton.className = `${options.className}__button` || 'edsc-map-layer-switcher__button'
    toggleButton.setAttribute('type', 'button')
    toggleButton.title = 'Layer Options'
    toggleButton.ariaLabel = 'Layer Options'

    if (options.LayersIcon) {
      ReactDOM.render(
        options.LayersIcon,
        toggleButton
      )
    }

    // Add the toggle button to the main element
    element.appendChild(toggleButton)

    // Create the panel element that will show the layer options
    const panel = document.createElement('div')
    panel.className = `${options.className}__panel` || 'edsc-map-layer-switcher__panel'

    this.addLayerOptions(panel)
    element.appendChild(panel)

    element.addEventListener('mouseenter', () => {
      panel.classList.add(`${options.className}__panel--visible` || 'edsc-map-layer-switcher__panel--visible')
    })

    element.addEventListener('mouseleave', () => {
      panel.classList.remove(`${options.className}__panel--visible` || 'edsc-map-layer-switcher__panel--visible')
    })
  }

  /**
   * Adds layer options to the panel
   */
  addLayerOptions(panel) {
    const className = this.options.className || 'edsc-map-layer-switcher'
    const layerOptions = this.options.layerOptions || [
      {
        id: 'world-imagery',
        label: 'World Imagery',
        checked: true
      },
      {
        id: 'corrected-reflectance',
        label: 'Corrected Reflectance (True Color)'
      },
      {
        id: 'land-water-map',
        label: 'Land / Water Map *'
      },
      {
        id: 'borders-roads',
        label: 'Borders and Roads *',
        checked: true
      },
      {
        id: 'place-labels',
        label: 'Place Labels *'
      }
    ]

    // Create a container for the options
    const optionsContainer = document.createElement('div')
    optionsContainer.className = `${className}__options`

    // Add each layer option
    layerOptions.forEach((option) => {
      const optionContainer = document.createElement('div')
      optionContainer.className = `${className}__option`

      // Create the radio/checkbox input
      const input = document.createElement('input')
      input.type = option.id === 'world-imagery' || option.id === 'corrected-reflectance' ? 'radio' : 'checkbox'
      input.name = option.id === 'world-imagery' || option.id === 'corrected-reflectance' ? 'base-layer' : option.id
      input.id = `layer-${option.id}`
      input.checked = option.checked || false

      input.addEventListener(EventType.CHANGE, () => {
        this.onChangeLayer({
          id: option.id,
          checked: input.checked,
          type: input.type
        })
      })

      // Create the label
      const label = document.createElement('label')
      label.htmlFor = `layer-${option.id}`
      label.textContent = option.label

      // Add the input and label to the option container
      optionContainer.appendChild(input)
      optionContainer.appendChild(label)
      optionsContainer.appendChild(optionContainer)
    })

    // Add the attribution footnote
    const attribution = document.createElement('div')
    attribution.className = `${className}__attribution`
    attribution.innerHTML = '* © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'

    // Add the options and attribution to the panel
    panel.appendChild(optionsContainer)
    panel.appendChild(attribution)
  }
}

export default LayerSwitcherControl
