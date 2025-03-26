import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import EventType from 'ol/events/EventType'

/**
 * This class adds a layer switcher control to the map
 */
class LayerSwitcherControl extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = options.className || 'edsc-map-layer-switcher ol-unselectable ol-control'

    super({
      ...options,
      element
    })

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

    element.appendChild(toggleButton)

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

    const optionsContainer = document.createElement('div')
    optionsContainer.className = `${className}__options`

    layerOptions.forEach((option) => {
      const optionContainer = document.createElement('div')
      optionContainer.className = `${className}__option`

      const input = document.createElement('input')
      input.type = option.id === 'world-imagery' || option.id === 'corrected-reflectance' || option.id === 'land-water-map' ? 'radio' : 'checkbox'
      input.name = option.id === 'world-imagery' || option.id === 'corrected-reflectance' || option.id === 'land-water-map' ? 'base-layer' : option.id
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
    })

    // Add the attribution footnote for OpenStreeMaps
    const attribution = document.createElement('div')
    attribution.className = `${className}__attribution`
    attribution.innerHTML = '* © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'

    panel.appendChild(optionsContainer)
    panel.appendChild(attribution)
  }
}

export default LayerSwitcherControl
